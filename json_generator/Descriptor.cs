using System;

namespace UpdateJson
{
    public class Descriptor
    {
        public string RelativeUrl { get; set; } = null;
        public string Id { get; set; } = null;
        public Func<string, string> GetName = null;
        public Func<string, string> GetDescription = null;
        public string Authors { get; set; } = null;
        public string Version { get; set; } = "1";
        public string ReleaseOrder { get; set; } = "1";
    }
}
