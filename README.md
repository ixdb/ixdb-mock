# ixdb-mock  Mock Server

`ixdb-mock` 是一个轻量级的前后端分离模拟测试工具。它允许前端开发者在后端 API 尚未完成时，通过一个简单的 Web 界面快速创建和管理模拟 API 接口，并立即获得可用的 JSON 数据返回。

## 🎯 功能特性

- **命令行启动**：通过一行命令即可启动服务，并可自定义端口。
- **可视化管理**：提供简洁的浏览器管理界面，无需编写代码即可配置接口。
- **动态 API 生成**：在 UI 中配置后，立即生成可访问的模拟 API 路径。
- **纯粹与专注**：专注于前端开发中最核心的 API 模拟需求，保持工具的小巧与高效。

## 🚀 快速开始

### 1. 环境准备

确保你已经安装了 Python 3。

### 2. 安装依赖

克隆或下载本项目，然后在项目根目录下打开终端，执行以下命令安装所需依赖：

```bash
pip install -r requirements.txt
```

### 3. 启动服务

执行主程序脚本来启动 Mock 服务器。你可以通过 `--port` 参数指定监听的端口，默认为 `8080`。

```bash
python ixdb_mock.py --port 8080
```

启动成功后，你将看到如下输出：

```
* Server started at http://localhost:8080
* Admin UI is available at http://localhost:8080
* Press CTRL+C to quit
```

### 4. 使用示例

1.  **打开管理界面**：
    在浏览器中访问 `http://localhost:8080`。

2.  **创建模拟接口**：
    - 在 "接口路径" 输入框中填写 `user/profile`。
    - 在 "属性" 区域，点击 "添加属性" 按钮，添加以下键值对：
      - `name`: `string`, `value`: `"Alex"`
      - `id`: `number`, `value`: `1001`
      - `isActive`: `boolean`, `value`: `true`
    - 点击 "创建接口" 按钮。

3.  **访问模拟 API**：
    你的模拟接口已经创建成功！现在通过 `curl` 或在浏览器中直接访问：
    `http://localhost:8080/json/user/profile`

4.  **获取结果**：
    你将得到如下配置的 JSON 返回：
    ```json
    {
      "name": "Alex",
      "id": 1001,
      "isActive": true
    }
    ```

现在，你可以在你的前端项目中使用这个 URL 进行开发和调试了！