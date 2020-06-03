using System.Collections.Generic;

namespace MemeApp.API.Dtos
{
    public class RoleEditDto
    {
        public IList<string> RolesToAdd { get; set; }

        public IList<string> RolesToRemove { get; set; }
    }
}