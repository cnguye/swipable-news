import React, { useState, useEffect, useRef } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import SelectForm from './components/SelectForm';
import CategoryHeadlines from './components/CategoryHeadlines';

import './styles/main.scss';
import './styles/page-theme.css';

function App() {
    const [categoryHeadlines, setCategoryHeadlines] = useState([]);
    const [currCategoryHeadlines, setCurrCategoryHeadlines] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(['general']);
    const [selectedNewCategory, setSelectedNewCategory] = useState();
    // const [deleteHistory, setDeleteHistory] = useState([]);

    // ignore first render const
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            let country = 'us';
            let category = 'general';
            let pagesize = 3;

            fetch(
                `/b/country/${country}/category/${category}/pagesize/${pagesize}`
            )
                .then((data) => data.json())
                .then((data) => {
                    const newsAPIHeadlines = data.newsAPIResponse;
                    newsAPIHeadlines.articles.map((article) => {
                        article['isDeleted'] = false;
                        return article;
                    });
                    const headlineData = {
                        category,
                        articles: newsAPIHeadlines.articles,
                    };
                    setCategoryHeadlines([...categoryHeadlines, headlineData]);
                    setCurrCategoryHeadlines([
                        ...categoryHeadlines,
                        headlineData,
                    ]);
                });
            return;
        }
        setCurrCategoryHeadlines(
            currCategoryHeadlines.filter((headlineObj) =>
                selectedCategories.includes(headlineObj.category)
            )
        );
        // eslint-disable-next-line
    }, [selectedCategories]);

    return (
        <div className='App'>
            <Header />
            <div className='App-container'>
                <div className='App-main'>
                    <div className='app-title__body'>
                        <h1 className='app-title'>United States News</h1>
                        <h3 className='app-sub-title'>
                            Latest headlines from across the nation...
                        </h3>
                    </div>
                    <SelectForm
                        currCategoryHeadlines={currCategoryHeadlines}
                        setCurrCategoryHeadlines={setCurrCategoryHeadlines}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        selectedNewCategory={selectedNewCategory}
                        setSelectedNewCategory={setSelectedNewCategory}
                    />
                    <div className='SocialCards-body'>
                        <CategoryHeadlines
                            currCategoryHeadlines={currCategoryHeadlines}
                            setCurrCategoryHeadlines={setCurrCategoryHeadlines}
                        />
                    </div>
                </div>
            </div>
            <div className='app-credits'>
                News provided by <a href='https://newsapi.org/'>NewsAPI</a>
            </div>
            <Footer />
        </div>
    );
}

export default App;
