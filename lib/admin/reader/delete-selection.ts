import type {ReaderContent} from '../firebase/reader-api';
export interface DeletePlan {parents:ReaderContent[];children:ReaderContent[]}
/** Resolve every child before any destructive request; delete children before series. */
export async function planReaderDeletion(items:ReaderContent[],list:(parent:ReaderContent)=>Promise<ReaderContent[]>):Promise<DeletePlan> {
 const parents=[...new Map(items.map(x=>[x.id,x])).values()];
 const children=[...new Map((await Promise.all(parents.filter(x=>x.kind==='series').map(list))).flat().map(x=>[x.id,x])).values()].filter(x=>!parents.some(p=>p.id===x.id));
 return {parents,children};
}
export async function executeReaderDeletion(plan:DeletePlan,remove:(item:ReaderContent)=>Promise<unknown>,progress:(done:number,total:number)=>void) {
 const ordered=[...plan.children,...plan.parents];let done=0;progress(done,ordered.length);
 for(const item of ordered){await remove(item);progress(++done,ordered.length);}
 return plan.parents.map(x=>x.id);
}
