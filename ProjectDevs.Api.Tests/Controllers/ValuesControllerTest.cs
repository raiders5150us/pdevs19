using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.DataAccess.Repositories;

namespace ProjectDevs.Api.Tests.Controllers
{
    [TestClass]
    public class ValuesControllerTest
    {
        private IRepoFactory _repoFactory;
        public ValuesControllerTest()
        {
            _repoFactory = new RepoFactory();
        }

        [TestMethod]
        public void Get()
        {
            //// Arrange
            //ValuesController controller = new ValuesController(_repoFactory);

            //// Act
            //IEnumerable<string> result = controller.Get();

            //// Assert
            //Assert.IsNotNull(result);
            //Assert.AreEqual(2, result.Count());
            //Assert.AreEqual("value1", result.ElementAt(0));
            //Assert.AreEqual("value2", result.ElementAt(1));
        }

        [TestMethod]
        public void GetById()
        {
            //// Arrange
            //ValuesController controller = new ValuesController(_repoFactory);

            //// Act
            //string result = controller.Get(5);

            //// Assert
            //Assert.AreEqual("value", result);
        }

        [TestMethod]
        public void Post()
        {
            //// Arrange
            //ValuesController controller = new ValuesController(_repoFactory);

            //// Act
            //controller.Post("value");

            //// Assert
        }

        [TestMethod]
        public void Put()
        {
            //// Arrange
            //ValuesController controller = new ValuesController(_repoFactory);

            //// Act
            //controller.Put(5, "value");

            //// Assert
        }

        [TestMethod]
        public void Delete()
        {
            //// Arrange
            //ValuesController controller = new ValuesController(_repoFactory);

            //// Act
            //controller.Delete(5);

            //// Assert
        }
    }
}
