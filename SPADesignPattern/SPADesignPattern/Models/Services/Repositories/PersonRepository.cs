using Microsoft.EntityFrameworkCore;
using SPADesignPattern.Frameworks;
using SPADesignPattern.Frameworks.ResponseFrameworks;
using SPADesignPattern.Frameworks.ResponseFrameworks.Contracts;
using SPADesignPattern.Models.DomainModels;
using SPADesignPattern.Models.Services.Contracts;
using System.Net;

namespace SPADesignPattern.Models.Services.Repositories
{
    public class PersonRepository : IPersonRepository
    {
        private readonly ProjectDbContext _dbContext;
        #region [- Ctor -]
        public PersonRepository(ProjectDbContext dbContext)
        {
            _dbContext = dbContext;
        } 
        #endregion

        #region [- Insert() -]
        public async Task<IResponse<Person>> Insert(Person model)
        {
             try
            {
                if (model is null)
                {
                    return new Response<Person>(false, HttpStatusCode.UnprocessableContent,ResponseMessages.NullInput, null);
                }
                await _dbContext.AddAsync(model);
                await _dbContext.SaveChangesAsync();
                var response = new Response<Person>(true, HttpStatusCode.OK,ResponseMessages.SuccessfullOperation, model);
                return response;
            }
            catch (Exception)
            {
                throw;
            }
        }
        #endregion

        #region [- SelectAll() -]
        public async Task<IResponse<IEnumerable<Person>>> SelectAll()
        {
            try
            {
                var person = await _dbContext.Person.AsNoTracking().ToListAsync();
                return person is null ? 
                    new Response<IEnumerable<Person>>(false, HttpStatusCode.UnprocessableContent,ResponseMessages.NullInput, null) :
                    new Response<IEnumerable<Person>>(true, HttpStatusCode.OK,ResponseMessages.SuccessfullOperation,person);
            }
            catch (Exception)
            {
                throw;
            }
        }
        #endregion

        #region [- Select() -]
        public async Task<IResponse<Person>> Select(Person model)
        {
            try
            {
                var responseValue = new Person();
                if (model.Id.ToString() != "")
                {
                    //responseValue = await _projectDbContext.Person.FindAsync(person.Email);
                    responseValue = await _dbContext.Person.Where(c => c.Email == model.Email).SingleOrDefaultAsync();
                }
                else
                {
                    responseValue = await _dbContext.Person.FindAsync(model.Id);
                }
                return responseValue is null ?
                     new Response<Person>(false, HttpStatusCode.UnprocessableContent,ResponseMessages.NullInput, null) :
                     new Response<Person>(true, HttpStatusCode.OK, ResponseMessages.SuccessfullOperation, responseValue);
            }
            catch (Exception)
            {
                throw;
            }
        } 
        #endregion

        #region [- Update() -]
        public async Task<IResponse<Person>> Update(Person model)
        {
            try
            {
                if (model is null)
                {
                    return new Response<Person>(false, HttpStatusCode.UnprocessableContent, ResponseMessages.NullInput, null);
                }
                //_projectDbContext.Update(model);
                _dbContext.Entry(model).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                var response = new Response<Person>(true, HttpStatusCode.OK, ResponseMessages.SuccessfullOperation, model);
                return response;
            }
            catch (Exception)
            {
                throw;
            }
        }
        #endregion

        #region [- Delete() -]
        public async Task<IResponse<Person>> Delete(Person model)
        {try
            {
                var DeleteRecord = await _dbContext.Person.FindAsync(model.Id);
                if (DeleteRecord == null) 
                {
                    return new Response<Person>(false, HttpStatusCode.NotFound, "Person not found", null);

                }
                if (model is null)
                {
                    return new Response<Person>(false, HttpStatusCode.UnprocessableContent, ResponseMessages.NullInput, null);
                }
                _dbContext.Person.Remove(model);
                await _dbContext.SaveChangesAsync();
                var response = new Response<Person>(true, HttpStatusCode.OK, ResponseMessages.SuccessfullOperation, model);
                return response;
            }
            catch (Exception)
            {
                return new Response<Person>(false, HttpStatusCode.InternalServerError, "Message", null);
            }
        }
        #endregion
    }
}

