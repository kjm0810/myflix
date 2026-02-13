import MovieList from "@/components/MovieList";

export default async function SearchResult({
  params
}: {
  params: Promise<{ keyword?: string }>
}) {
  const paramsData = await params;
  const keyword = decodeURIComponent(String(paramsData?.keyword || ''))


    return (
        <div className="frame">
            <div className="container">
                <h2 className="movieListTitle">
                    {`"${keyword}"`}에 대한 검색 결과입니다.
                </h2>
            </div>
            <MovieList isRandomMovie={false} isTitle={false} keyword={keyword}></MovieList>
        </div>
    );    
}