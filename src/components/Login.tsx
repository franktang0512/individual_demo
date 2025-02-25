import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router'; // 確保使用的是正確的 useNavigate
import '../Login.css';

// 定義 props 的型別
interface LoginProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    isLoggedIn: boolean;
}

const Login: React.FC<LoginProps> = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate(); // 確保使用 useNavigate

    // ✅ 使用 useState 來管理登入狀態
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    useEffect(() => {
        if (isLoggedIn) {
            navigate({ to: "/questions" });
        }
    }, [isLoggedIn, navigate]);

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setError('');

    //     try {
    //         const response = await fetch('http://140.122.251.19:3000/api/login', {
    //             credentials: 'include',
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ username, password }),
    //         });

    //         if (!response.ok) {
    //             const { message } = await response.json();
    //             throw new Error(message || '登入失敗');
    //         }

    //         const data = await response.json();
    //         console.log('登入成功，Token:', data);

    //         setIsLoggedIn(true);
    //         navigate({ to: "/questions" });
    //     } catch (error: any) {
    //         setError(error.message);
    //     }
    // };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // http://140.122.251.19:3000/api/me
        try {
            const response = await fetch('http://140.122.251.19:3000/api/login', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message || '登入失敗');
            }

            const data = await response.json();
            // console.log('登入成功，Token:', data);
            setIsLoggedIn(true);

            // ✅ 儲存登入狀態到 localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('studentID', data.studentID);
            localStorage.setItem('challengeID', data.challengeID);
            
            localStorage.setItem('studentName', data.studentName);
            window.dispatchEvent(new Event("storage")); // ✅ 觸發 storage 事件，確保 `__root.tsx` 更新
            navigate({ to: "/" }); // ✅ 跳轉到首頁
            

            
            // navigate({ to: "/questions" });
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="container">
            <div 
                className="left-wrapper"
                style={{ flex: 2 }}
        
            >
                <div className="left">
                    {/* <h1>Chippy Challenge</h1> */}
                    <h1>全國資訊科技示範賽</h1>
                    <div className="arrows">&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;</div>
                </div>
            </div>
            <div className="right-wrapper">
                <div className="right">
                    <h2>登入挑戰</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="帳號"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="密碼"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">
                            開始挑戰
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;