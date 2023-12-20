import React, { Dispatch, SetStateAction } from 'react';

interface DogFormProps {
    dogData: {
        dogname: string;
        breed: string;
        gender: string;
        birthday: string;
        description: string;
    };
    setDogData: Dispatch<SetStateAction<{
        dogname: string;
        breed: string;
        gender: string;
        birthday: string;
        description: string;
    }>>;
}

const DogForm: React.FC<DogFormProps> = ({ dogData , setDogData}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDogData({ ...dogData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/dogs', { // 替换为您的API端点
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dogData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Submit Success:', result);
        } catch (error) {
            console.error('Submit Error:', error);
        }
    };

    return (
        <>  
        <form onSubmit={handleSubmit}>
            <h1>狗狗名字</h1>
            <input name="dogname" value={dogData.dogname} onChange={handleChange} />

            {/* <h1>品種</h1>
            <input name="breed" value={dogData.breed} onChange={handleChange} />
            <h1>性別</h1>
            <input name="gender" value={dogData.gender} onChange={handleChange} />
            <h1>生日</h1>
            <input name="birthday" type="date" value={dogData.birthday} onChange={handleChange} />
            <h1>描述</h1>
            <input name="description" value={dogData.description} onChange={handleChange} /> */}

            <button type="submit">提交</button>
        </form>
        </>
    );
};

export default DogForm;
