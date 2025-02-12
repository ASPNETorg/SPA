using SPADesignPattern.Models.DomainModels;

namespace SPADesignPattern.Models.Services.Contracts
{
    public interface IPersonRepository: IRepository<Person, IEnumerable<Person>>
    {
       
    }
}
