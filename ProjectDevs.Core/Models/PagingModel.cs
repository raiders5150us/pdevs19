using ProjectDevs.Core.Constants;
using System.Collections.Generic;

namespace ProjectDevs.Core.Models
{
    public class PagingModel<T>
    {
        public int Count { get; set; }
        public int CurrentPageNumber { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<T> Data { get; set; }
        public dynamic AdditionalData { get; set; }
        public bool HasMoreRows => (PageSize * CurrentPageNumber) < Count;
        public bool IsLastPage => !HasMoreRows;
        public PagingModel()
        {

        }
        public PagingModel(IEnumerable<T> data, int count, int pno = 1, int psize = PdConstants.DefaultPageSize, dynamic additionalData = null)
        {
            Data = data;
            Count = count;
            CurrentPageNumber = pno;
            PageSize = psize;
            AdditionalData = additionalData;
        }
    }
}
