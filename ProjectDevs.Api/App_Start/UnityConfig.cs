using ProjectDevs.Business.Caching;
using ProjectDevs.Business.Services;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Interfaces.Services;
using ProjectDevs.DataAccess.Repositories;
using System.Web.Http;
using Unity;
using Unity.Lifetime;
using Unity.WebApi;

namespace ProjectDevs.Api
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
            var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            container.RegisterType<IRepoFactory, RepoFactory>();

            container.RegisterType<ICacheService, CacheService>();
            container.RegisterSingleton<IEmailService, EmailService>();

            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }

    public static class UnityExtensions
    {
        public static IUnityContainer RegisterScoped<TFrom, TTo>(this IUnityContainer container) where TTo : TFrom =>
            container.RegisterType<TFrom, TTo>(new PerResolveLifetimeManager());
        public static IUnityContainer RegisterScoped<T>(this IUnityContainer container) =>
            container.RegisterType<T>(new PerResolveLifetimeManager());
        public static IUnityContainer RegisterScopedInstance<TInterface>(this IUnityContainer container, TInterface instance) =>
            container.RegisterInstance<TInterface>(instance);
    }
}