import { Pagination } from 'antd';

const PaginationComponent = ({ totalMovies, page, onChange }) => {
  const maxTotalMovies = 100;
  const limitedTotalMovies = Math.min(totalMovies, maxTotalMovies);

  return (
    <>
      {totalMovies > 0 ? (
        <Pagination
          className="pagination"
          defaultCurrent={1}
          pageSize={20}
          onChange={(e) => onChange(e)}
          current={page}
          total={limitedTotalMovies}
          showSizeChanger={false}
        />
      ) : null}
    </>
  );
};

export default PaginationComponent;
