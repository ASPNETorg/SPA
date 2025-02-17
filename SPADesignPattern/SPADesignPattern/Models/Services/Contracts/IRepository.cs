using Azure;
using SPADesignPattern.Frameworks.ResponseFrameworks.Contracts;

namespace SPADesignPattern.Models.Services.Contracts
{
    public interface IRepository<T, TCollection>
    {
        Task<IResponse<TCollection>> SelectAll();
        Task<IResponse<T>> Select(T obj);
        Task<IResponse<T>> Insert(T obj);
        Task<IResponse<T>> Update(T obj);
        Task<IResponse<T>> Delete(Guid id);
    }
}
