import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const DetailPopup = ({selectedMovie, closeDetail}: {selectedMovie: movieItem | null, closeDetail: any}) => {
    return (
        <div className='detailPopup'>
            <div className='inner'>
                <div className='top'>
                    <div className='title'>
                        {selectedMovie?.title}
                    </div>
                    <div className='popupClose' onClick={closeDetail}>
                    <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
                <div className='contents'>
                    <div className='openDate'>
                        {selectedMovie?.release_date}
                    </div>
                    <div className='overView'>
                        {selectedMovie?.overview}
                    </div>
                    <img
                        src={`https://image.tmdb.org/t/p/original${selectedMovie?.poster_path}`}
                        alt={selectedMovie?.title}
                    />
                </div>
            </div>
        </div>
    );
};

export default DetailPopup;