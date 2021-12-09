using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace UpdateJson
{
    class Program
    {
        static int Main(string[] args)
        {
            var folders = new List<string>() { "official", "nonofficial" };
            var descriptors = new List<Descriptor>();
            bool hasError = false;

            foreach (var folder in folders)
            {
                foreach (string file in Directory.EnumerateFiles(folder, "*.js", SearchOption.AllDirectories))
                {
                    var script = File.ReadAllText(file);

                    try
                    {
                        var descriptor = Parser.Parse(script);
                        descriptor.RelativeUrl = file.Replace('\\', '/');
                        descriptors.Add(descriptor);
                    }
                    catch(Exception e)
                    {
                        Console.WriteLine("Could not parse '" + file + "': " + e.Message);
                        hasError = true;
                    }
                }
            }

            if (hasError)
            {
                Console.WriteLine("One or more error occured. The json file was not generated.");
                return -1;
            }

            var json = new StringBuilder();

            json.Append("[\n");

            foreach (var descriptor in descriptors)
            {
                json.Append("  {\n");
                json.Append("    \"relative_url\": \"" + Escape(descriptor.RelativeUrl) + "\",\n");
                json.Append("    \"id\": \"" + Escape(descriptor.Id) + "\",\n");
                json.Append("    \"name\": \"" + Escape(descriptor.Name) + "\",\n");
                json.Append("    \"description\": \"" + Escape(descriptor.Description) + "\",\n");
                json.Append("    \"authors\": \"" + Escape(descriptor.Authors) + "\",\n");
                json.Append("    \"version\": \"" + Escape(descriptor.Version) + "\",\n");
                json.Append("  }");

                if (descriptor != descriptors.Last())
                    json.Append(",\n");
            }

            json.Append("\n]");

            File.WriteAllText("theories.json", json.ToString());

            return 0;
        }

        private static string Escape(string text)
        {
            return text.Replace("\\", "\\\\")
                       .Replace("\"", "\\\"")
                       .Replace("\n", "\\n")
                       .Replace("\r", "\\r")
                       .Replace("\t", "\\t");
        }
    }
}
