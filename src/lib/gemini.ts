 import {GoogleGenerativeAI} from'@google/generative-ai';
import { Document } from '@langchain/core/documents';

 const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
 const model = genAI.getGenerativeModel({
    model:'gemini-1.5-flash'
 });

 export const aiSummarizeCommit = async (diff: string) => {

   try {
      const res = await model.generateContent([
         `You are a skilled Git commit summarizer. Given the following diff, please provide a concise, high-level summary of the changes made. Focus on the main modifications—such as added features, bug fixes, or refactoring—without getting bogged down in minor details. Present the summary in clear, easy-to-read bullet points.`,
         
         `Please summarize the following diff file: \n\n${diff}`,
 
     ]);
 
     return  res.response.text();
      
   } catch (error) {

      console.error(error);
      throw error;
      
   }
   
 } 

export async function summarizeCode(doc: Document){
   console.log('getting summary for', doc.metadata.source);

   try {
      const code = doc.pageContent.slice(0, 10); // Limit to 10 characters
      const res = await model.generateContent([
         `You are an intelligent senior software engineer who specializes in onboarding junior engineers onto projects`,
         `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file. Please provide a high-level summary of the code in the file, focusing on its main functionality and purpose. Avoid getting bogged down in minor details, and present the summary in clear, easy-to-understand bullet points.`,
         `Here is the code:\n\`\`\`${code}\n\`\`\`
   
         Give a summary not more than 100 words of he code above
         `
      ]);
   
      return res.response.text();
      
   } catch (error) {
      console.error(error);
      // throw error;
      return '';
      
   }
  
} 


export async function generateEmbedding(summary:string){
   const model = genAI.getGenerativeModel({
      model:'text-embedding-004'
   });

   const result = await model.embedContent(summary.slice(0, 5));
   // console.log(result.embedding.values);
   
   return result.embedding.values;
}


