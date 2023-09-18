import _ from 'lodash';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, MouseEventHandler } from 'react';

const customPaginator = ({
  rows,
  totalRecords,
  first,
  onPageChange
}: {
  rows?: number | undefined;
  totalRecords?: number | undefined;
  first?: number | undefined;
  onPageChange?: (event: PaginatorPageChangeEvent) => void;
}) => {

  const template2 = {
    layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink',
    'PrevPageLink': (options: {
      className: string | undefined;
      onClick: MouseEventHandler<HTMLButtonElement> | undefined;
      disabled: boolean | undefined;
    }) => {
      return (
        <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
          <span className="p-3">&lt;&nbsp;&nbsp;<span className='pagination-text'>Previous</span></span>
        </button>
      )
    },
    'NextPageLink': (options: {
      className: string | undefined;
      onClick: MouseEventHandler<HTMLButtonElement> | undefined;
      disabled: boolean | undefined;
    }) => {
      return (
        <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
          <span className="p-3 pagination-icon"><span className='pagination-text'>Next</span>&nbsp;&nbsp;&gt;</span>
        </button>
      )
    },
    'CurrentPageReport': (options: {
      first: string | number | boolean |
      ReactElement<any, string | JSXElementConstructor<any>> |
      ReactFragment | ReactPortal | null | undefined; last: string |
      number | boolean | ReactElement<any, string | JSXElementConstructor<any>> |
      ReactFragment | ReactPortal | null | undefined; totalRecords: string | number
      | boolean | ReactElement<any, string | JSXElementConstructor<any>> |
      ReactFragment | ReactPortal | null | undefined;
    }) => {
      return (
        <div style={{ color: 'var(--surface-900)', userSelect: 'none',
         width: 'auto', textAlign: 'left', flex: 1}}>
          {_.isNaN(options.first) ? 0 : options.first} - 
         <span className='p-l-4'>{_.isNaN(options.last) ? 0 : options.last} </span>  of {_.isNaN(options.totalRecords) ? 0 : options.totalRecords} items
        </div>
      )
    }
  };
  return (
    <Paginator
      rows={rows}
      totalRecords={totalRecords}
      first={first}
      onPageChange={onPageChange}
      template={template2}
      pageLinkSize={3}
    ></Paginator>
  );
};

export default customPaginator;
