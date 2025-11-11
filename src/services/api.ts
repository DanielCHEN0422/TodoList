const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 生成设备ID（存储在 localStorage）
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device-id');
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('device-id', deviceId);
  }
  return deviceId;
};

export interface Todo {
  _id: string
  title: string
  description?: string
  completed: boolean
  category?: '工作' | '学习' | '生活' | '自定义'
  customCategory?: string
  priority?: '低' | '中' | '高'
  version?: number
  lastModifiedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface ConflictError {
  conflict: boolean
  serverVersion: number
  clientVersion: number
  serverTodo: Todo
  message: string
}

// 获取所有待办事项
export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE_URL}/todos`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
};

// 创建待办事项
export const createTodo = async (todo: {
  title: string
  description?: string
  completed?: boolean
  category?: '工作' | '学习' | '生活' | '自定义'
  customCategory?: string
  priority?: '低' | '中' | '高'
}): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': getDeviceId(),
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  return response.json();
};

// 更新待办事项（支持冲突检测）
export const updateTodo = async (
  id: string,
  todo: {
    title?: string
    description?: string
    completed?: boolean
    category?: '工作' | '学习' | '生活' | '自定义'
    customCategory?: string
    priority?: '低' | '中' | '高'
    version?: number
  }
): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': getDeviceId(),
    },
    body: JSON.stringify(todo),
  });
  
  if (response.status === 409) {
    // 冲突错误
    const conflictData = await response.json();
    throw { ...conflictData, isConflict: true } as ConflictError;
  }
  
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  return response.json();
};

// 删除待办事项
export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};

// 删除所有已完成的待办事项
export const deleteCompletedTodos = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/completed/all`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete completed todos');
  }
};

