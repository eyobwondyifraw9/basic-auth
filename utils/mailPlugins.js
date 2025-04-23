const fs = require("fs");
const juice = require("juice");
const path = require("path");
const {compileFile} = require("pug");

exports.compilePug = () => (mail, callback) => {
    const { template, locals } = mail.data;
    if (!template) return callback(new Error("Missing template in mail.data"));
  
    const templatePath = path.resolve("emails", template + ".pug");  
    
    if (!fs.existsSync(templatePath)) {
      return callback(new Error("pug template not found at " + templatePath));
    }
    
    const compile = compileFile(templatePath);
    let html = compile(locals);
  
    mail.data.html = html;

    callback();
}

exports.inlineCssStyles = (resourceFolder = "./public") => async (mail, callback) => {
  
    const inlinedHtml = await new Promise((resolve, reject) => {
        juice.juiceResources(
            mail.data.html,
            {
                webResources: {
                    relativeTo: path.resolve(resourceFolder),
                    images: false,
                }
            },
            (err, result) => {
                if(err) reject(err);
                else resolve(result);
            }
        )
    });

    mail.data.html = inlinedHtml;
    callback();
};