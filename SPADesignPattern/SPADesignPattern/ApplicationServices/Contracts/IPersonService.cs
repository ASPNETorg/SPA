using SPADesignPattern.ApplicationServices.Dtos.PersonDtos;

namespace SPADesignPattern.ApplicationServices.Contracts;

public interface IPersonService : 
    IService<PostPersonServiceDto, GetPersonServiceDto, GetAllPersonServiceDto, PutPersonServiceDto, DeletePersonServiceDto>
{
}