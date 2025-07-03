import argparse
import json
from flask import Flask, request, jsonify, render_template, abort

# 1. 初始化 Flask 应用
app = Flask(__name__, static_folder='static', template_folder='static')

# 2. 数据存储 (初期使用内存中的字典)
# 格式: {"path/to/api": {"key": "value"}}
mock_db = {}

# --- 业务逻辑：API 管理 ---

@app.route('/api/mocks', methods=['GET'])
def get_all_mocks():
    """获取所有已配置的 mock 接口"""
    return jsonify(mock_db)

@app.route('/api/mocks/<path:mock_path>', methods=['POST'])
def create_or_update_mock(mock_path):
    """创建或更新一个 mock 接口"""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    mock_db[mock_path] = data
    print(f"[*] Mock created/updated for path: /{mock_path}")
    return jsonify({"message": "Mock created/updated successfully", "path": mock_path}), 201

@app.route('/api/mocks/<path:mock_path>', methods=['DELETE'])
def delete_mock(mock_path):
    """删除一个 mock 接口"""
    if mock_path in mock_db:
        del mock_db[mock_path]
        print(f"[*] Mock deleted for path: /{mock_path}")
        return jsonify({"message": "Mock deleted successfully"}), 200
    else:
        return jsonify({"error": "Mock path not found"}), 404

# --- 业务逻辑：模拟 API 访问 ---

@app.route('/<string:data_format>/<path:mock_path>', methods=['GET'])
def serve_mock_data(data_format, mock_path):
    """根据路径返回配置好的 mock 数据"""
    # 目前只支持 json，将来可扩展
    if data_format.lower() != 'json':
        abort(404, description=f"Format '{data_format}' not supported yet.")

    if mock_path in mock_db:
        response_data = mock_db[mock_path]
        return jsonify(response_data)
    else:
        abort(404, description=f"Mock data for path '{mock_path}' not found.")


# --- 业务逻辑：服务管理界面 ---

@app.route('/')
def index():
    """提供管理界面的主页"""
    return render_template('index.html')


# --- 主程序入口 ---

if __name__ == '__main__':
    # 设置命令行参数解析
    parser = argparse.ArgumentParser(description="ixdb-mock: A simple mock server.")
    parser.add_argument('--port', type=int, default=8080, help='Port to run the server on.')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='Host to bind the server to.')
    args = parser.parse_args()

    host = args.host
    port = args.port

    print("=" * 50)
    print("🚀 ixdb-mock Server Starting...")
    print(f"* Server started at http://localhost:{port}")
    print(f"* Admin UI is available at http://localhost:{port}")
    print("* Press CTRL+C to quit")
    print("=" * 50)
    
    # 启动 Flask 服务器
    # 使用 'waitress' 或 'gunicorn' 在生产环境中会更健壮
    # 但对于开发工具来说，Flask 自带的服务器足够了
    app.run(host=host, port=port)