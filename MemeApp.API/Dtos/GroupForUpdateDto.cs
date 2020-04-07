namespace MemeApp.API.Dtos
{
    public class GroupForUpdateDto
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }

        public int[] UsersToAdd { get; set; }

        public int[] UsersToRemove { get; set; }
    }
}