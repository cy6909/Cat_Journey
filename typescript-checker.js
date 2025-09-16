#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TypeScriptChecker {
    constructor() {
        this.projectRoot = process.cwd();
        this.scriptsPath = path.join(this.projectRoot, 'assets', 'scripts');
        this.logFile = path.join(this.projectRoot, 'typescript-check.log');
    }

    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}\n`;
        
        console.log(logEntry.trim());
        fs.appendFileSync(this.logFile, logEntry);
    }

    async runTypeScriptCheck() {
        this.log('🔍 Starting TypeScript static analysis...');
        
        return new Promise((resolve, reject) => {
            // 使用npx tsc进行类型检查，不生成文件，只检查类型
            const tsc = spawn('npx', ['tsc', '--noEmit', '--skipLibCheck'], {
                cwd: this.projectRoot,
                stdio: 'pipe'
            });

            let stdout = '';
            let stderr = '';

            tsc.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            tsc.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            tsc.on('close', (code) => {
                if (code === 0) {
                    this.log('✅ TypeScript static check passed - No type errors found!', 'SUCCESS');
                    resolve({ success: true, errors: [] });
                } else {
                    this.log('❌ TypeScript static check failed - Type errors detected!', 'ERROR');
                    const errors = this.parseTypeScriptErrors(stderr || stdout);
                    this.logErrors(errors);
                    resolve({ success: false, errors });
                }
            });

            tsc.on('error', (error) => {
                this.log(`Failed to run TypeScript check: ${error.message}`, 'ERROR');
                reject(error);
            });
        });
    }

    parseTypeScriptErrors(output) {
        const errors = [];
        const lines = output.split('\n');
        
        for (const line of lines) {
            if (line.trim() && !line.includes('Found ') && !line.includes('error TS')) {
                continue;
            }
            
            // 匹配TypeScript错误格式: file(line,col): error TSxxxx: message
            const errorMatch = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
            if (errorMatch) {
                errors.push({
                    file: errorMatch[1],
                    line: parseInt(errorMatch[2]),
                    column: parseInt(errorMatch[3]),
                    code: errorMatch[4],
                    message: errorMatch[5]
                });
            }
        }
        
        return errors;
    }

    logErrors(errors) {
        if (errors.length === 0) return;

        this.log(`📋 Found ${errors.length} TypeScript errors:`, 'ERROR');
        
        const errorsByFile = {};
        errors.forEach(error => {
            if (!errorsByFile[error.file]) {
                errorsByFile[error.file] = [];
            }
            errorsByFile[error.file].push(error);
        });

        Object.keys(errorsByFile).forEach(file => {
            this.log(`\n📁 ${file}:`, 'ERROR');
            errorsByFile[file].forEach(error => {
                this.log(`  ├─ Line ${error.line}, Column ${error.column}: ${error.code} - ${error.message}`, 'ERROR');
            });
        });
    }

    async checkFileCount() {
        try {
            const stats = await this.getFileStats();
            this.log(`📊 TypeScript files analyzed: ${stats.totalFiles} files, ${stats.totalLines} lines`);
            return stats;
        } catch (error) {
            this.log(`Error analyzing files: ${error.message}`, 'ERROR');
            return null;
        }
    }

    async getFileStats() {
        const stats = { totalFiles: 0, totalLines: 0 };
        
        const walkDir = (dir) => {
            const files = fs.readdirSync(dir);
            
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    walkDir(filePath);
                } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
                    stats.totalFiles++;
                    const content = fs.readFileSync(filePath, 'utf8');
                    stats.totalLines += content.split('\n').length;
                }
            });
        };
        
        if (fs.existsSync(this.scriptsPath)) {
            walkDir(this.scriptsPath);
        }
        
        return stats;
    }

    async runFullCheck() {
        // 清空日志文件
        fs.writeFileSync(this.logFile, '');
        
        this.log('🚀 Starting comprehensive TypeScript analysis...');
        this.log('═'.repeat(60));
        
        // 检查文件统计
        await this.checkFileCount();
        
        // 运行TypeScript检查
        const result = await this.runTypeScriptCheck();
        
        this.log('═'.repeat(60));
        if (result.success) {
            this.log('🎉 All checks passed! Your code is ready for production.', 'SUCCESS');
        } else {
            this.log(`❌ Found ${result.errors.length} issues that need to be fixed.`, 'ERROR');
            this.log('\n💡 Common fixes:', 'INFO');
            this.log('  • Add null checks: const x = obj?.property', 'INFO');
            this.log('  • Use type assertions: obj as Type', 'INFO');
            this.log('  • Check import paths are correct', 'INFO');
        }
        
        return result;
    }
}

// CLI usage
if (require.main === module) {
    const checker = new TypeScriptChecker();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'check':
        case undefined:
            checker.runFullCheck().catch(console.error);
            break;
        case 'stats':
            checker.checkFileCount().catch(console.error);
            break;
        case 'help':
            console.log(`
TypeScript Static Checker - Cat-Conquest Project

Usage:
  node typescript-checker.js [command]

Commands:
  check    Run full TypeScript static analysis (default)
  stats    Show project file statistics
  help     Show this help message

Examples:
  node typescript-checker.js           # Run full check
  node typescript-checker.js check     # Same as above
  node typescript-checker.js stats     # Show file stats only
            `);
            break;
        default:
            console.log(`Unknown command: ${command}`);
            console.log('Run "node typescript-checker.js help" for usage information.');
    }
}

module.exports = TypeScriptChecker;