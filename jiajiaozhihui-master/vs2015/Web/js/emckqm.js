
 
 
function StTimeChange() {
 
CountDh() ;

}
function EtTimeChange() {

 CountDh() ;
 
}
function CountDh() {
   var stDate = ObjStDate.value;
   var enDate = ObjEtDate.value;
   var stTime = ObjStTime.value;
   var enTime = ObjEtTime.value;

   var TotalHours = SumLeaveHour(stDate,enDate,stTime,enTime,wd1,wd2,ht);
   TotalHours=Math.round(TotalHours * 10) / 10;
   var thours=TotalHours;
   var totalDays=0;
   if(TotalHours>=dh) {
      totalDays = parseInt((TotalHours/dh));
      thours= TotalHours-totalDays*dh;
      thours=Math.round(thours * 10) / 10;
   }
   ObjTotalHours.value=thours;
   ObjTotalDays.value=totalDays;
}



 function   SumLeaveHour(stDate,enDate,stTime,enTime,wd1,wd2,ht)//Ӌ��Ո�ٹ��r ����δ�ļ���  
  {   //ht ������Ϣʱ�� wd1�ܼ���Ϣ,wd2
        var   st,en,hours   =   0;   
        var   tmp   =   stDate.split("-");   
        var   tmp2   =   stTime.replace(":",",");   
        var   tmp3   =   stTime.split(":");
        var   tmp4   =   enTime.split(":");
        
        //ע���·ݣ����O�Þ�   0   -   11   ������   
        eval("st   =new   Date("+tmp[0]+","+(tmp[1]-1)+","+tmp[2]+","+tmp2+");");     
        tmp   =   enDate.split("-");   
        tmp2   =   enTime.replace(":",",");   
        eval("en   =new   Date("+tmp[0]+","+(tmp[1]-1)+","+tmp[2]+","+tmp2+");");   
        tmp   =   1000*60*60*24;   //һ��ĺ��딵   
        var   days   =   Math.round((en.getTime()   -   st.getTime())/tmp);   
        tmp=1000*60*60;//һ��С�r�ĺ��딵   
        if(days>0)   //����ͬһ��   
        {   
              var   st2   =   new   Date(st.getFullYear(),st.getMonth(),st.getDate(),tmp4[0],tmp4[1]);   
              var   en2   =   new   Date(en.getFullYear(),en.getMonth(),en.getDate(),tmp3[0],tmp3[1]);   
              if(st.getDay()!=wd1   &&   st.getDay()!=wd2)   //���_�p����   
              {   
                 hours   =   (st2.getTime()   -   st.getTime())/tmp;   //��һ���Ո�ٹ��r   
                 if(st.getHours()<13)   
                   {   
                     hours   -=   ht;   
                   }   
              }   
              if(en.getDay()!=wd1   &&   en.getDay()!=wd2)   
              {   
                  hours   +=   (en.getTime()   -   en2.getTime())/tmp   ;//����һ���Ո�ٹ��r   
                  if(en.getHours()>13)   
                    {   
                     hours   -=   ht;   
                    }   
              }   
              tmp2   =   0;   
              for(var   i   =1;i<days;i++)   
              {   
                st2.setTime(st.getTime()+tmp*24*i);       
                if(st2.getDay()!=wd1   &&   st2.getDay()!=wd2)   
                {   
                       tmp2   ++;   //�ĵ�һ�쵽����һ��֮�g�ж��ق�������   
                 }   
              }   
              hours   +=   tmp2*dh;   
        }   
        else   if(days   ==   0)   //��ͬһ��   
        {   
              hours   =   (en.getTime()/tmp)-(st.getTime()/tmp);   
              if(st.getHours()<13   &&   en.getHours()>13)   
              {   
                    hours   -=   ht;   //����������Ϣ�r�g   
              }   
        }   
        if(hours<0)
          {
           hours=0;
           }   
        return   hours;   
  }


  