import React, {useState} from 'react';
import AgeEstimationPage from './pages/AgeEstimationPage/AgeEstimationPage';
import CatFactPage from './pages/CatFactPage/CatFactPage';
import Header from './components/Header/Header';
import './App.css';

const App: React.FC = () => {
    const [isAgeEstimationPage, setIsAgeEstimationPage] = useState<boolean>(false);

    const togglePage = () => {
        setIsAgeEstimationPage(prevState => !prevState);
    };

    const currentPage = isAgeEstimationPage ? 'Факты о котах' : 'Оценка возраста';

    return (
        <>
            <Header/>
            <div className="button-container">
                <button onClick={togglePage} className="toggle-button">{currentPage} &#8594;</button>
            </div>
            <div className="page-wrapper">
                {isAgeEstimationPage ? (
                    <AgeEstimationPage/>
                ) : (
                    <CatFactPage/>
                )}
            </div>
        </>
    );
};

export default App;