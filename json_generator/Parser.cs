using Jint;
using System;
using System.Collections.Generic;

namespace UpdateJson
{
    public static class Parser
    {
        public static Descriptor Parse(string script)
        {
            var nodes = GetDeclarationNodes(script);
            var engine = new Jint.Engine().Execute(new Esprima.Ast.Script(nodes, false));
            return new Descriptor()
            {
                Id = GetValue(engine, "id"),
                Name = GetValue(engine, "name"),
                Description = GetValue(engine, "description"),
                Authors = GetValue(engine, "authors"),
                Version = TryGetValue(engine, "version", out string versionStr) && int.TryParse(versionStr, out int version) ? version.ToString() : "1",
            };
        }

        private static Esprima.Ast.NodeList<Esprima.Ast.Statement> GetDeclarationNodes(string script)
        {
            var program = new Esprima.JavaScriptParser(script).ParseScript();
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
                        identifier.Name == "version")
                    {
                        AssertLiterals(identifier.Name, variableDeclarator.Init);
                        nodes.Add(element);
                    }
                }
            }

            return Esprima.Ast.NodeList.Create(nodes);
        }

        private static bool TryGetValue(Jint.Engine engine, string name, out string outValue)
        {
            outValue = null;
            var value = engine.GetValue(name);

            if (value.IsUndefined() || value.IsNull())
                return false;

            outValue = value.ToString();
            return true;
        }

        private static string GetValue(Jint.Engine engine, string name)
        {
            var value = engine.GetValue(name);

            if (value.IsUndefined() || value.IsNull())
                ThrowRequiredParameter(name);

            return value.ToString();
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

            if (node.Type != Esprima.Ast.Nodes.Literal)
                ThrowInvalidLiteral(name);
        }

        private static void ThrowRequiredParameter(string name)
        {
            throw new Exception("The variable \"" + name + "\" is required.");
        }

        private static void ThrowInvalidLiteral(string name)
        {
            throw new Exception("The variable \"" + name + "\" must be a literal.");
        }
    }
}
