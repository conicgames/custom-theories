using Jint;
using Jint.Native;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;

namespace UpdateJson
{
    public static class Parser
    {
        public static Descriptor Parse(string script)
        {
            // Extract only the lines we care about
            var nodes = GetDeclarationNodes(script);

            // Evaluate selected lines
            var engine = new Jint.Engine(cfg => cfg.Culture(CultureInfo.GetCultureInfo("en-US")));
            engine.Execute(new Esprima.Ast.Script(nodes, false));

            // Name & Description fields can be either static or dynamic
            TryGetString(engine, "name", out string name);
            TryGetString(engine, "description", out string description);
            TryGetValue(engine, "getName", out JsValue getName);
            TryGetValue(engine, "getDescription", out JsValue getDescription);

            if (name == null && getName == null)
                throw new Exception("The theory must either provide 'name' or 'getName'");

            if (description == null && getDescription == null)
                throw new Exception("The theory must either provide 'description' or 'getDescription'");

            // Extract values from the evaluation
            return new Descriptor()
            {
                Id = GetString(engine, "id"),
                Authors = GetString(engine, "authors"),
                GetName = (l) => GetTranslation(engine, "name", l, name, getName),
                GetDescription = (l) => GetTranslation(engine, "description", l, description, getDescription),
                Version = TryGetString(engine, "version", out string versionStr) && int.TryParse(versionStr, out int version) ? version.ToString() : "1",
                ReleaseOrder = TryGetString(engine, "releaseOrder", out string releaseOrderStr) && int.TryParse(releaseOrderStr, out int releaseOrder) ? releaseOrder.ToString() : "1",
            };
        }

        private static string Sanitize(string script)
        {
            // Remove import statements
            return string.Join("\n", Regex.Split(script, "\r\n|\r|\n").Select(l => l.StartsWith("import") ? "" : l));
        }

        private static Esprima.Ast.NodeList<Esprima.Ast.Statement> GetDeclarationNodes(string script)
        {
            var program = new Esprima.JavaScriptParser(Sanitize(script)).ParseScript();
            var nodes = new List<Esprima.Ast.Statement>();

            foreach (var element in program.Body)
            {
                if (element is Esprima.Ast.VariableDeclaration variable &&
                    variable.ChildNodes.Count > 0 &&
                    variable.ChildNodes[0] is Esprima.Ast.VariableDeclarator variableDeclarator &&
                    variableDeclarator.Id is Esprima.Ast.Identifier identifier)
                {
                    if (identifier.Name == "id" ||
                        identifier.Name == "name" ||
                        identifier.Name == "description" ||
                        identifier.Name == "authors" ||
                        identifier.Name == "version" ||
                        identifier.Name == "releaseOrder")
                    {
                        AssertLiterals(identifier.Name, variableDeclarator.Init);
                        nodes.Add(element);
                    }
                    else if (identifier.Name == "getName" ||
                             identifier.Name == "getDescription")
                    {
                        nodes.Add(element);
                    }
                }
            }

            return Esprima.Ast.NodeList.Create(nodes);
        }

        private static bool TryGetValue(Jint.Engine engine, string name, out JsValue value)
        {
            value = engine.GetValue(name);

            if (value.IsUndefined() || value.IsNull())
            {
                value = null;
                return false;
            }

            return true;
        }

        private static JsValue GetValue(Jint.Engine engine, string name)
        {
            if (!TryGetValue(engine, name, out JsValue value))
                throw new Exception("The symbol \"" + name + "\" is required.");

            return value;
        }

        private static bool TryGetString(Jint.Engine engine, string name, out string value)
        {
            if (TryGetValue(engine, name, out JsValue jsValue))
            {
                value = jsValue.ToString();
                return true;
            }

            value = null;
            return false;
        }

        private static string GetString(Jint.Engine engine, string name)
        {
            return GetValue(engine, name)?.ToString() ?? null;
        }

        private static string GetTranslation(Jint.Engine engine, string name, string language, string staticValue, JsValue dynamicValue)
        {
            string result = null;

            if (dynamicValue != null)
            {
                var dynamicResult = engine.Invoke(dynamicValue, new[] { JsValue.FromObject(engine, language) });

                if (!dynamicResult.IsNull() && !dynamicResult.IsUndefined())
                    result = dynamicResult.ToString();
            }

            if (string.IsNullOrEmpty(result))
                result = staticValue;

            if (string.IsNullOrEmpty(result))
                throw new Exception("The theory " + name + " cannot be null. Language: \"" + language + "\".");

            return result;
        }

        private static void AssertLiterals(string name, Esprima.Ast.Node node)
        {
            if (node is Esprima.Ast.BinaryExpression binaryExpression)
            {
                if (binaryExpression.Operator != Esprima.Ast.BinaryOperator.Plus)
                    ThrowInvalidLiteral(name);

                foreach (var child in node.ChildNodes)
                    AssertLiterals(name, child);
            }
            else if (node.Type != Esprima.Ast.Nodes.Literal)
            {
                ThrowInvalidLiteral(name);
            }
        }

        private static void ThrowInvalidLiteral(string name)
        {
            throw new Exception("The variable \"" + name + "\" must be a literal.");
        }
    }
}
