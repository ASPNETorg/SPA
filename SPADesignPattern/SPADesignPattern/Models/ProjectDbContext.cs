using Microsoft.EntityFrameworkCore;
using SPADesignPattern.Models.DomainModels;

namespace SPADesignPattern.Models
{
    public class ProjectDbContext : DbContext
    {
        public ProjectDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Person> Person { get; set; }
    }
}
