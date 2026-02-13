'use client'

import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const [searchBoxVisable,setSearchBoxVisable] = useState('off');
    const [searchQuery,setSearchQuery] = useState('');
    const searchBoxButtonToggle = () =>{
        if(searchBoxVisable == 'off'){
            setSearchBoxVisable("on");
        }
        else{
            setSearchBoxVisable("off");
        }
    }
    const movieSearch = () => {
        if (searchQuery.trim() !== '') {
            setSearchBoxVisable("off");
            setSearchQuery('');
            router.push(`/search/${searchQuery}`);
        }
    }
    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            movieSearch();
        } else if (e.key === 'Escape') {
            setSearchBoxVisable("off");
        }
    };

    return (
        <header>
            <div className='container'>
                <div className='inner'>
                    <ul>
                        <li className="logo"><Link href="/">MYFLIX</Link></li>
                        <li><Link href="/">홈</Link></li>
                        <li><Link href="/genre">장르별 영화</Link></li>
                        <li><Link href="/likeMovie">좋아요한 영화</Link></li>
                    </ul>
                    <div className='searchBox'>
                        <div className='searchBoxButton' onClick={()=>{searchBoxButtonToggle()}}>
                            <FontAwesomeIcon icon={faSearch} color='#FFF' fontSize={"25px"}/>
                            검색
                        </div>
                        <div  className={searchBoxVisable+' searchBar'}>
                            <div className='container'>
                                <div className='inner'>
                                    <input 
                                        type='text' 
                                        value={searchQuery} 
                                        onChange={(e) => setSearchQuery(e.target.value)} 
                                        onKeyDown={handleKeyDown}
                                        placeholder='영화제목을 입력해주세요.'
                                    />
                                    <FontAwesomeIcon icon={faSearch} color='#FFF' fontSize={"25px"} onClick={()=>{movieSearch()}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}