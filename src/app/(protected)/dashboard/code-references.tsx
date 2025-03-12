"use client";

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn, escapeCHX } from '@/lib/utils';
import React from 'react'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {lucario} from 'react-syntax-highlighter/dist/esm/styles/prism'


type Props = {
    fileReferences: {fileName: string, sourceCode: string, summary: string}[];
}

const CodeReferences = ({fileReferences}: Props) => {
    const [tab, setTab] = React.useState(fileReferences[0]?.fileName);
    if(fileReferences.length === 0) return <div>No references found</div>
  return (
    <div className='max-w-[80vw] overflow-hidden'>
        <Tabs value={tab} onValueChange={setTab} >
            <div className="flex gap-2 bg-gray-200 p-1 rounded-md overflow-x-auto scrollbar-hide">
                {fileReferences.map((file, i) => (
                    <button 
                    onClick={() => setTab(file.fileName)}
                    key={i} className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-muted',
                        {
                            'bg-primary text-primary-foreground': tab === file.fileName,
                        }
                    )}>
                        {file.fileName}
                    </button>
                ))}
            </div>
            {fileReferences.map((file, i) => (
                 <TabsContent key={i} value={file.fileName} className='max-h-[40vh] max-w-[80vw] rounded-md overflow-y-scroll scrollbar-hide'>
                        <SyntaxHighlighter language='typescript' style={lucario}
                           wrapLines={true}
                           showLineNumbers={true}
                         wrapLongLines={true}> 
                                {escapeCHX(file.sourceCode)}

                        </SyntaxHighlighter>
                 </TabsContent>
            ))}

        </Tabs>
    </div>
  )
}

export default CodeReferences