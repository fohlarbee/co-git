"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog,  DialogContent, DialogTitle,DialogHeader } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useProject from '@/hooks/use-project';
import Image from 'next/image';
import React from 'react'
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';
import MDEditor from '@uiw/react-md-editor';
import CodeReferences from './code-references';
import DOMPurify from 'dompurify';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import useRefresh from '@/hooks/use-refresh';
import { htmlToMarkdown } from '@/lib/utils';

const AskQuestionCard  = () => {
  const {project} = useProject();
  const [question, setQuestion] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setIsLoading] = React.useState(false);
  const [filesReferences, setFilesReferences] = React.useState<{fileName: string, sourceCode: string, summary: string}[]>([]);
  const [answer, setAnswer] = React.useState('');
  const saveAnswer = api.project.saveAnswer.useMutation();
  const refresh =  useRefresh();
  console.log(saveAnswer.isPending)
  const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    setAnswer('');
    setFilesReferences([]);
    e.preventDefault();
    if( !project?.id) return;
    setIsLoading(true);
 
    const {output, filesReferences} = await askQuestion(question, project.id);
    setFilesReferences(filesReferences);
    setOpen(true);


    for await (const delta of readStreamableValue(output)){
      if (delta)
        setAnswer(ans => ans + delta);
      console.log('delta', delta);
      console.log('answer', answer);
    }

    setIsLoading(false); 

  }  

  return (
    <>
          <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className='sm:max-w-[80vw] overflow-y-scroll scrollbar-hide max-h-full'>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <DialogTitle>
                        <Image src="/images/up-left.png" alt="logo" width={40} height={50} />
                    </DialogTitle>
                    <Button
                          disabled={saveAnswer.isPending}
                          onClick={() => saveAnswer.mutate({
                            projectId: project!.id,
                            question,
                            answer: htmlToMarkdown((DOMPurify.sanitize(answer))),
                            filesReferences: filesReferences
                          }, {
                            onSuccess: () => {
                              toast.success('Answer saved!');
                              // setOpen(false);
                              refresh();

                            },
                            onError: (error) => {
                              toast.error('Failed to save answer');
                              console.error(error);
                            }

                          })}
                     variant='outline'>
                          Save Answer
                    </Button>
                    
                  </div>
                </DialogHeader>
                <MDEditor.Markdown  
                  // style={{ whiteSpace: 'pre-wrap' }}
                  // urlTransform={true}
                  
                source={htmlToMarkdown((DOMPurify.sanitize(answer)))} className='max-w-[80vw] h-full max-h-[40vh] overflow-y-scroll'/>
                <div className="h-4"></div>
                <CodeReferences fileReferences={filesReferences}/>
                <Button type='button' onClick={() => setOpen(false)}>Close</Button>
               
              </DialogContent>
          </Dialog>
          <Card className='relative col-span-3 '>
              <CardHeader> 
                  <CardTitle>Ask A Question</CardTitle>
                  
              </CardHeader>
              <CardContent>
                  <form onSubmit={onSubmit}>
                      <Textarea placeholder='Which file do you want to ask about?' value={question}
                        onChange={e => setQuestion(e.target.value)}
                      />
                      <div className="h-4"></div>
                      <Button type='submit' disabled={loading}>
                            Ask Co-Git
                      </Button>
                  </form>
              </CardContent>

          </Card>
    </>
  )
}

export default AskQuestionCard 