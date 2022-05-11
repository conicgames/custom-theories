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
            var languages = new List<string>() { "en", "ar", "zh-Hans", "zh-Hant", "cs", "de", "es", "fa", "fr", "he", "id", "it", "ja", "ko", "lv", "hu", "nl", "no", "pl", "pt-br", "pt", "ru", "uk", "sk", "fi", "vi", "tr" };
            var defaultLanguage = "en";
            var descriptors = new List<Descriptor>();
            bool hasError = false;

            // Parse descriptors
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

            // Write descriptors to memory in json format
            var aggregateFile = new StringBuilder();
            var individualFiles = new Dictionary<string, StringBuilder>();

            aggregateFile.Append("[\n");

            foreach (var descriptor in descriptors)
            {
                // Utility function to enumerate translations of a field
                void writeTranslations(StringBuilder file, Func<string, string> getTranslation, string indent)
                {
                    string safeGetTranslation(string language)
                    {
                        try
                        {
                            return getTranslation(language);
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine("Could not parse '" + descriptor.RelativeUrl + "': " + e.Message);
                            hasError = true;
                            return "";
                        }
                    }

                    var defaultTranslation = safeGetTranslation(defaultLanguage);

                    file.Append(indent);
                    file.Append("\"default\": \"" + Escape(defaultTranslation) + "\"");

                    foreach (var language in languages)
                    {
                        var translation = safeGetTranslation(language);

                        if (translation != defaultTranslation)
                        {
                            file.Append(",\n");
                            file.Append(indent);
                            file.Append("\"" + language + "\": \"" + Escape(translation) + "\"");
                        }
                    }
                }

                // Write aggregate info
                aggregateFile.Append("  {\n");
                aggregateFile.Append("    \"relativeUrl\": \"" + Escape(descriptor.RelativeUrl) + "\",\n");
                aggregateFile.Append("    \"id\": \"" + Escape(descriptor.Id) + "\",\n");
                aggregateFile.Append("    \"name\": {\n");
                writeTranslations(aggregateFile, descriptor.GetName, "      ");
                aggregateFile.Append("\n    },\n");
                aggregateFile.Append("    \"authors\": \"" + Escape(descriptor.Authors) + "\",\n");
                aggregateFile.Append("    \"description\": \"" + Escape(descriptor.GetDescription(defaultLanguage)) + "\",\n");
                aggregateFile.Append("    \"version\": \"" + Escape(descriptor.Version) + "\",\n");
                aggregateFile.Append("    \"releaseOrder\": \"" + Escape(descriptor.ReleaseOrder) + "\"\n");
                aggregateFile.Append("  }");

                if (descriptor != descriptors.Last())
                    aggregateFile.Append(",\n");

                // Write individual info
                var individualFile = new StringBuilder();

                individualFile.Append("{\n");
                individualFile.Append("  \"description\": {\n");
                writeTranslations(individualFile, descriptor.GetDescription, "    ");
                individualFile.Append("\n  }\n");
                individualFile.Append("}");

                // Change extension to json
                var filename = System.IO.Path.ChangeExtension(descriptor.RelativeUrl, ".json");

                individualFiles.Add(filename, individualFile);
            }

            aggregateFile.Append("\n]");

            // Early quit if any error were encountered
            if (hasError)
            {
                Console.WriteLine("One or more error occured. The json file was not generated.");
                return -1;
            }

            // Remove previous json files
            foreach (var folder in folders)
                foreach (string file in Directory.EnumerateFiles(folder, "*.json", SearchOption.AllDirectories))
                    File.Delete(file);

            // Commit descriptors to files
            File.WriteAllText("theories.json", aggregateFile.ToString());

            foreach (var file in individualFiles)
                File.WriteAllText(file.Key, file.Value.ToString());

            Console.WriteLine("Success!");

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
