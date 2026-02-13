import GenreItem from '@/components/GenreItem';
import { headers } from 'next/headers';

export default async function Genre() {
    const headerList = await headers();

    const protocol =
        headerList.get('x-forwarded-proto') ?? 'http';

    const host =
        headerList.get('x-forwarded-host') ??
        headerList.get('host');

    const baseUrl = `${protocol}://${host}`;

    let genreData: [] = [];
    
    const option = {
        url: 'genre/movie/list'
    };
    try {
        const res = await fetch(`${baseUrl}/api/tmdb/list?url=${option.url}`);
        const data = await res.json();
        genreData = data.genres
        
    }
    catch(e) {
        console.error(e);
    }
    return (
        <div className="frame">
            <div className="container">
                <div className="genre">
                    <h2 className="movieListTitle">
                        장르
                    </h2>
                    {
                        genreData.map((item: genre, index: number) => {
                            return (
                                <GenreItem genre={item} key={`genre-item-${item.id}`}></GenreItem>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}