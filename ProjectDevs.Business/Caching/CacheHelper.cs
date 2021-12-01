using System.Web;

namespace ProjectDevs.Business.Caching
{
    public static class CacheHelper
    {
        public static T GetItem<T>(string key) => (T)HttpRuntime.Cache[key];
        public static void SetItem<T>(string key, T value) => HttpRuntime.Cache.Insert(key, value);
        public static void RemoveItem(string key) => HttpRuntime.Cache.Remove(key);
    }
}
