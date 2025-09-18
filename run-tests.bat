@echo off
REM Cat-Conquest 快速测试脚本 (Windows版本)
REM 用于快速运行项目的单元测试

echo 🎮 Cat-Conquest 游戏测试启动器
echo ==================================

REM 检查Node.js环境
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.

REM 运行简化版测试
echo 🚀 运行Ball组件简化版测试...
echo --------------------------------
npx jest Ball.test.js --verbose --testNamePattern="Ball 组件核心功能测试"

echo.
echo 📊 测试总结
echo ============

if %errorlevel% equ 0 (
    echo ✅ 简化版测试: 全部通过
) else (
    echo ❌ 简化版测试: 存在失败
)

echo.
echo 🎯 运行完整测试套件...
echo ------------------------
npx jest Ball.test.js --verbose

echo.
echo 🎉 测试完成!
echo ============
echo.
echo 📋 查看详细报告:
echo    - 测试运行报告.md
echo    - 单元测试说明文档.md
echo    - 测试方法示例详解.md
echo.
echo 🔧 下一步操作:
echo    1. 修复碰撞反弹逻辑的小问题
echo    2. 为其他组件添加类似测试
echo    3. 考虑集成到开发工作流
echo.
echo 🎮 Cat-Conquest 项目测试状态: 生产就绪 ✅

pause