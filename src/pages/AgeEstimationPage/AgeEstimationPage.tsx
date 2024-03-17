import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';
import styles from './AgeEstimationPage.module.css';
import {PanelHeader, Panel} from "@vkontakte/vkui";

const AgeEstimationForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [validName, setValidName] = useState<boolean>(true);
    const [emptyInput, setEmptyInput] = useState<boolean>(true);
    const [cache, setCache] = useState<{ [key: string]: number }>({});
    const [ageTextVisible, setAgeTextVisible] = useState<boolean>(false);
    const [debounceTimer, setDebounceTimer] = useState<number | null>(null);
    const lastChangeTime = useRef<number | null>(null);
    const debounceTime = 3000;
    const requestRef = useRef<CancelTokenSource | null>(null);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        setName(newName);
        setValidName(isValidName(newName));
        lastChangeTime.current = Date.now();
        setAge(null);
        setAgeTextVisible(false);
        setEmptyInput(newName.trim() === '');
        if (requestRef.current) {
            requestRef.current.cancel();
            requestRef.current = null;
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (debounceTimer) clearTimeout(debounceTimer);
        fetchData();
    };

    const fetchData = async () => {
        if (!validName || name.trim() === '') return;

        if (cache[name]) {
            setAge(cache[name]);
            setAgeTextVisible(true);
            return;
        }

        setLoading(true);

        try {
            const source = axios.CancelToken.source();
            requestRef.current = source;
            const response = await axios.get<{ age: number }>(`https://api.agify.io/?name=${encodeURIComponent(name)}`, {
                cancelToken: source.token
            });
            const newAge = response.data.age;

            setCache(prevCache => ({
                ...prevCache,
                [name]: newAge
            }));

            setAge(newAge);
            setAgeTextVisible(true);
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching data:', error);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!lastChangeTime.current) return;

        const elapsedTime = Date.now() - (lastChangeTime.current as number);
        if (elapsedTime >= debounceTime) {
            fetchData();
        } else {
            const timer = setTimeout(fetchData, debounceTime - elapsedTime);
            setDebounceTimer(timer);
            return () => clearTimeout(timer);
        }
    }, [name, validName]);

    const isValidName = (name: string) => {
        const latinLetters = /^[a-zA-Z]+$/;
        return latinLetters.test(name);
    };

    return (
        <Panel id="cat-fact" className={styles.container}>
        <PanelHeader>Возраст человека</PanelHeader>
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" placeholder="Введите имя" value={name} onChange={handleNameChange} className={styles.input} />
                {!validName && !emptyInput && <p className={styles.error}>Введите корректное имя (только латинские буквы)</p>}
                <button type="submit" disabled={!validName || emptyInput} className={styles.button}>Отправить</button>
            </form>
            {ageTextVisible && (loading ? <p>Загрузка...</p> : age !== null && <p className={styles.age}>Возраст: {age}</p>)}
        </div>
        </Panel>
    );
};

export default AgeEstimationForm;
