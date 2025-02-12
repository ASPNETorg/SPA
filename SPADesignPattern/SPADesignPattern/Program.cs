using Microsoft.EntityFrameworkCore;
using SPADesignPattern.ApplicationServices.Contracts;
using SPADesignPattern.ApplicationServices.Services;
using SPADesignPattern.Models.Services.Contracts;
using SPADesignPattern.Models.Services.Repositories;
using SPADesignPattern.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

#region [- AddDbContext() -]
var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<ProjectDbContext>(options => options.UseSqlServer(connectionString)); 
#endregion

#region [- Models IOC -]
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
#endregion

#region [- ApplicationServices IOC -]
builder.Services.AddScoped<IPersonService, PersonService>();
#endregion

//builder.Services.AddControllers(options =>
//{
//    options.AllowEmptyInputInBodyModelBinding = true;
//}).AddJsonOptions(options =>
//{
//    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
//});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
