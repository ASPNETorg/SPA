namespace SPADesignPattern.ApplicationServices.Dtos.PersonDtos;

public class DeletePersonServiceDto
{
    // For single deletion, you can keep this property
    public Guid Id { get; set; } // Nullable to allow for bulk deletion

    // For bulk deletion, add a list of IDs
    public List<Guid> DeletePersonDtosList { get; set; } = new List<Guid>();
}