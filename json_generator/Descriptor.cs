using System;
using System.Collections.Generic;
using System.Text;

namespace UpdateJson
{
    public class Descriptor
    {
        public string RelativeUrl { get; set; } = null;
        public string Id { get; set; } = null;
        public string Name { get; set; } = null;
        public string Description { get; set; } = null;
        public string Authors { get; set; } = null;
        public string Version { get; set; } = "1";
    }
}
