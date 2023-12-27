import { Pagination } from 'antd';

const PaginationComponent = ({ totalMovies, page, onChange }) => {
  return (
    <>
      {totalMovies > 0 ? (
        <Pagination
          className="pagination"
          defaultCurrent={1}
          pageSize={20}
          onChange={(e) => onChange(e)}
          current={page}
          total={totalMovies}
          showSizeChanger={false}
        />
      ) : null}
    </>
  );
};

export default PaginationComponent;
