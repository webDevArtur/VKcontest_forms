import { Panel, PanelHeader, Button } from '@vkontakte/vkui';
import { useState, useEffect, useRef } from 'react';
import { fetchCatFact } from '../../api/api';
import styles from './CatFactPage.module.css';

const CatFactPage = () => {
    const [catFact, setCatFact] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFetchCatFact = async () => {
        setIsLoading(true);
        try {
            const fact = await fetchCatFact();
            setCatFact(fact);
        } catch (error) {
            console.error('Error fetching cat fact:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (inputRef.current && catFact) {
            const firstSpaceIndex = catFact.indexOf(' ');
            if (firstSpaceIndex !== -1) {
                const input = inputRef.current;
                input.value = catFact;
                input.setSelectionRange(firstSpaceIndex + 1, firstSpaceIndex + 1);
                input.focus();
            }
        }
    }, [catFact]);

    return (
        <Panel id="cat-fact" className={styles.container}>
            <PanelHeader>Факт о котиках</PanelHeader>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Факт о котиках"
                    ref={inputRef}
                    disabled={isLoading}
                    className={styles.input}
                />
            </div>
            <div className={styles.buttonContainer}>
                <Button size="l" onClick={handleFetchCatFact} className={styles.button} disabled={isLoading}>
                    {isLoading ? <>Загрузка...</> : 'Факт о котиках'}
                </Button>
            </div>
        </Panel>
    );
};

export default CatFactPage;
