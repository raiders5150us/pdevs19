using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Linq;


namespace ProjectDevs.Business.Extensions
{
    public static class CollectionExtensions
    {
        public static IEnumerable<T> GetPaged<T>(this IEnumerable<T> items, int pno = 1, int psize = PdConstants.DefaultPageSize) =>
            items?.Skip((pno - 1) * psize).Take(psize);

        public static PagingModel<T> GetPagingModel<T>(this IEnumerable<T> items, int pno = 1, int psize = PdConstants.DefaultPageSize) =>
            new PagingModel<T>
            {
                Count = items.Count(),
                CurrentPageNumber = pno,
                PageSize = psize,
                Data = items.GetPaged<T>(pno, psize)
            };

        public static string MergeStrings(this IEnumerable<string> items, char separator = ',') =>
            items?.Aggregate((m0, m1) => $"{m0}{separator}{m1}")?.Trim(separator);

    }
}
