namespace MemeApp.API.Dtos
{
    public class GroupForCreationDto
    {
        public string GroupName { get; set; }

        public string Message { get; set; }

        public int[] UserIds { get; set; }
    }
}