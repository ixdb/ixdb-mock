document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '/api/mocks';
    const MOCK_API_PREFIX = '/json';

    const mockList = document.getElementById('mock-list');
    const createForm = document.getElementById('create-mock-form');
    const mockPathInput = document.getElementById('mock-path');
    const propertiesContainer = document.getElementById('json-properties');
    const addPropertyBtn = document.getElementById('add-property-btn');

    // --- Functions ---

    // 获取并刷新列表
    const fetchMocks = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            const mocks = await response.json();
            
            mockList.innerHTML = '';
            if (Object.keys(mocks).length === 0) {
                mockList.innerHTML = '<li>暂无数据，请在上方创建。</li>';
                return;
            }

            for (const path in mocks) {
                const li = document.createElement('li');
                const fullPath = `${MOCK_API_PREFIX}/${path}`;
                
                li.innerHTML = `
                    <span>
                        <a href="${fullPath}" target="_blank"><code>${fullPath}</code></a>
                    </span>
                    <button class="btn btn-danger" data-path="${path}">删除</button>
                `;
                mockList.appendChild(li);
            }
        } catch (error) {
            console.error('Failed to fetch mocks:', error);
            mockList.innerHTML = '<li>加载失败，请检查服务状态。</li>';
        }
    };

    // 添加一个属性输入行
    const addPropertyRow = () => {
        const row = document.createElement('div');
        row.className = 'property-row';
        row.innerHTML = `
            <input type="text" placeholder="Key" class="prop-key" required>
            <select class="prop-type">
                <option value="string" selected>String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
            </select>
            <input type="text" placeholder="Value" class="prop-value" required>
            <button type="button" class="btn-danger" onclick="this.parentElement.remove()">-</button>
        `;
        propertiesContainer.appendChild(row);
    };

    // 表单提交处理
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        
        const path = mockPathInput.value.trim();
        if (!path) {
            alert('接口路径不能为空');
            return;
        }

        const jsonData = {};
        const propRows = propertiesContainer.querySelectorAll('.property-row');
        let isValid = true;

        propRows.forEach(row => {
            const key = row.querySelector('.prop-key').value.trim();
            const type = row.querySelector('.prop-type').value;
            const value = row.querySelector('.prop-value').value.trim();

            if (!key) {
                isValid = false;
                return;
            }

            try {
                if (type === 'number') {
                    jsonData[key] = Number(value);
                    if (isNaN(jsonData[key])) throw new Error();
                } else if (type === 'boolean') {
                    if (value.toLowerCase() === 'true') {
                        jsonData[key] = true;
                    } else if (value.toLowerCase() === 'false') {
                        jsonData[key] = false;
                    } else {
                        throw new Error();
                    }
                } else {
                    jsonData[key] = value;
                }
            } catch {
                alert(`属性 '${key}' 的值 '${value}' 不是一个有效的 ${type} 类型!`);
                isValid = false;
            }
        });

        if (!isValid) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData),
            });

            if (response.ok) {
                await fetchMocks();
                // Reset form
                mockPathInput.value = '';
                propertiesContainer.innerHTML = '';
                addPropertyRow();
            } else {
                const errorData = await response.json();
                alert(`创建失败: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Failed to create mock:', error);
            alert('创建接口时出错，请查看控制台。');
        }
    };

    // 删除处理
    const handleDelete = async (event) => {
        if (event.target.matches('.btn-danger')) {
            const path = event.target.dataset.path;
            if (confirm(`确定要删除接口 ${MOCK_API_PREFIX}/${path} 吗？`)) {
                try {
                    const response = await fetch(`${API_BASE_URL}/${path}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        await fetchMocks();
                    } else {
                        const errorData = await response.json();
                        alert(`删除失败: ${errorData.error}`);
                    }
                } catch (error) {
                    console.error('Failed to delete mock:', error);
                    alert('删除接口时出错，请查看控制台。');
                }
            }
        }
    };

    // --- Event Listeners ---
    addPropertyBtn.addEventListener('click', addPropertyRow);
    createForm.addEventListener('submit', handleFormSubmit);
    mockList.addEventListener('click', handleDelete);

    // --- Initial Load ---
    fetchMocks();
    addPropertyRow(); // Start with one empty property row
});