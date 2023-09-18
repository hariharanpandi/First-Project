
/*Getting Query Param Values*/
export const getQueryParam = (paramName:string) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(paramName);
  }