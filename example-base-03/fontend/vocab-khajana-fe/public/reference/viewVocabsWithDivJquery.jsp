<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@ page import="java.io.*,java.util.*,javax.xml.parsers.ParserConfigurationException,org.xml.sax.SAXException,com.prem.vocab.build.proj.VocabBuildConstants.Examples,com.prem.vocab.build.proj.VocabBuildConstants.Meanings,com.prem.vocab.build.proj.VocabBuildConstants.Word,com.prem.vocab.build.proj.util.XMLUtilityImpl"%>

<html>
<script type="text/javascript" src="http://127.0.0.1:8888/jquery-1.3.2/jquery-1.3.2.min.js"></script>

<style type="text/css">
	.htmlClass{
		padding:8px;
		border:1px solid blue;
		margin-bottom:8px;
	}
	.excerciseHeader{
		FONT: 24px Verdana, Arial, Helvetica, sans-serif;
	}
	
	.albumHeader{
		FONT: 18px Verdana, Arial, Helvetica, sans-serif;
	}
	.commandHeader{
		padding:2px;
		border:1px solid red;
		FONT: 12px Verdana, Arial, Helvetica, sans-serif;
	}
	.commandHeader:focus,
	.commandHeader:hover {
		border:1px solid yellow;
		FONT: 16px Verdana, Arial, Helvetica, sans-serif;
		font-weight: bold;
	}
</style>

<style>
body {
 width: 650px;
 margin: 0 auto;
 background: green;
 /*background: #000;*/
 color: #FFF;
 font: 12px sans-serif;
}
h1 {
 font-size: 24px;
}
h2 {
 font-size: 18px;
 margin-top: 0;
}
a {
 color: #FFF;
}
a:focus,
a:hover {
 text-decoration: none;
}
table {
 margin-bottom: 10px;
 border-spacing: 0;
}
caption {
 margin-bottom: 10px;
 font-size: 14px;
 font-weight: bold;
 text-align: left;
}
th,
td {
 padding: 0 10px 0 0;
 text-align: left;
}
.planet {
 margin: 10px 0;
 padding: 20px 20px 20px 200px;
 border: 1px solid #FFF;
 background-position: 100px 20px;
 /*background-repeat: no-repeat;*/
}

.planetURL {
 margin: 10px 0;
 padding: 20px 20px 20px 100px;
 border: 1px solid yellow;
 background-position: 100px 20px;
 /*background-repeat: no-repeat;*/
}

.premu426{
background-image: url(http://127.0.0.1:8888/bce/css/prem.jpg);
}
</style>

<body onload="showNextExerciseAndImages()">
  <span class="albumHeader">jQuery html() example : This html page is designed to help in memorizing words </span><br/>
  <table>
	  <tr>
		  <td>
			<span id="nextExcerciseMover" class="commandHeader"> Next Word move </span> 
		  </td>
		  <td>
			<span id="previousExcerciseMover" class="commandHeader"> Previous Word move </span>
		  </td>
		  <td>
			<span id="next50ExcerciseMover" class="commandHeader"> Jump to next 50 Word move </span>
		  </td>
	  </tr>
	  <tr>
			<td>
				<span>Offset <input id="txtOffset" type="text" width="20" height="10"/></span>
			</td>
			<td>
				<span>Count<input id="txtCount" type="text" width="20" height="10"/></span>
			</td>
			<td>
				<span id="btnChangeSettings" class="commandHeader">Change settings</span>
			</td>
	  </tr>
  </table>

  
  <div id="currentStatusdisplayer" class="commandHeader">Current Status</div>
  
  <%
		int offset=0;
		int count=0;
		try{
			offset=Integer.parseInt(request.getParameter("offset"));			
		}catch(Exception e){
		
		}
		try{
			count=Integer.parseInt(request.getParameter("count"));			
		}catch(Exception e){
		
		}
		
  %>
	<script>
		document.getElementById('txtOffset').value=<%=offset%>;
		document.getElementById('txtCount').value=<%=count%>;
		//var myOffset=document.getElementById('txtOffset').value;
		//var myCount=document.getElementById('txtCount').value;
	</script>

<%
	
	try {
		XMLUtilityImpl xmlUtilityImpl=new XMLUtilityImpl();
		List<HashMap<String, String>> list = xmlUtilityImpl
					.getAllDescription();

			//PrintStream out = System.out;

			method3(out,list,xmlUtilityImpl);

			out.println(list.size());
	} catch (ParserConfigurationException e) {
		e.printStackTrace();
	} catch (SAXException e) {
		e.printStackTrace();
	} catch (IOException e) {
		e.printStackTrace();
	}catch (Exception e) {
		e.printStackTrace();
	}

%>

<%!
	public static final String exerciseNodeContainer="exerciseNodeContainer";
	public static final String exerciseHeaderNode="exerciseHeaderNode";
	public static final String currentExerciseNodeAllowedTimeToDisplay="currentExerciseNodeAllowedTimeToDisplay";
	public static final String exerciseNode="exerciseNode";
	public static final String exerciseNodeImageList="exerciseNodeImageList";
	public static final String exerciseNodeImage="exerciseNodeImage";
	public static final String fileWriterURL="http://127.0.0.1:8888/bce/fileWriter?documentId=";
	public static final String imageWidth="500";
	public static final String imageHeight="500";
	public static final String allowedTimeForWord="120";
	%>

		<div class="planetURL">
				We will write all words name here and this should be in the left side of page. Preferably it should be always visible.
		</div>
<%!

private void method3(JspWriter out,List<HashMap<String, String>> list,XMLUtilityImpl xmlUtilityImpl) throws Exception{

				int allCount=0;
				for (int i = list.size() - 1; i >= 0; i--) {
				HashMap<String, String> mapObject = list.get(i);

				if (mapObject.keySet() != null && mapObject.keySet().size() > 0) {
				
					///////////////
					out.println("<div id=\""+exerciseNodeContainer+(i+1)+"\">");
					out.println("<div id=\"" + exerciseHeaderNode+(i+1)+"\" class=\"excerciseHeader\">" + getValue(mapObject,
							Word.node.getName()) +"</div>");
					out.println("<div id=\"" + currentExerciseNodeAllowedTimeToDisplay+(i+1)+"\" >" + allowedTimeForWord +"</div>");
					out.println("<div id=\""+exerciseNode+(i+1)+"\" class=\"htmlClass prem\">");
					out.println("<div id=\""+exerciseNodeImageList+(i+1)+"\">");
					out.println("<div id=\""+exerciseNodeImage+(i+1)+"_"+(i+1)+"\">");
					//////////////
					
					out.println("<div class=\"planet premu426\">");
					
					out.println("<table>");
					String mapValueForKey = getValue(mapObject,
							Word.node.getName());
					out.println("<tr>");
					out.println("<td>");
					out.println(Word.node.getName() + ":" + "<h1>"
							+(++allCount)+" : "+ mapValueForKey + "</h1>");
					out.println("</td>");
					

					mapValueForKey = getValue(mapObject, Word.TYPE.getName());
					
					out.println("<td>");
					out.println(Word.TYPE.getName() + ":" + "<h1>"
							+ mapValueForKey + "</h1>");
					out.println("</td></tr>");

					mapValueForKey = getValue(mapObject,
							Meanings.node.getName());
					
					if (mapValueForKey != null
							&& !mapValueForKey.trim().equalsIgnoreCase("")) {
						String[] strarr = mapValueForKey.trim().split("-->");
						int count = 0;
						out.println("<tr>");
						out.println("<td>");
						out.println(Meanings.node.getName());
						out.println("</td>");
						out.println("<td>");
						for (String str : strarr) {
							
							out.println("<h1>" +(++count) + " : " + " : " +  str
									+ "</h1>");
						}
						out.println("</td></tr>");

					}					

					mapValueForKey = getValue(mapObject,
							Examples.node.getName());
					
					if (mapValueForKey != null
							&& !mapValueForKey.trim().equalsIgnoreCase("")) {
						String[] strarr = mapValueForKey.trim().split("-->");
						int count = 0;
						out.println("<tr>");
						out.println("<td>");
						out.println(Examples.node.getName());
						out.println("</td>");
						out.println("<td>");
						for (String str : strarr) {
							
							out.println("<h1>" +(++count) + " : " + " : " +  str
									+ "</h1>");
						}
						out.println("</td></tr>");

					}
					
					out.println("</table>");
					out.println("</div>");
					
					///////////
					out.println("</div>");
					out.println("</div>");
					out.println("</div>");
					out.println("</div>");
					/////////
				}
				
			}

			out.println(list.size());
				
			
			
			
}%>


<%!
public static String getValue(HashMap<String, String> mapObject, String key) {
		String ret = "";
		if (mapObject.containsKey(key)) {
			ret = mapObject.get(key);
			ret = (ret != null) ? ret : "";
		}

		return ret;
	}

%>

<script type="text/javascript">
		
	var exerciseNode='exerciseNode';
	var exerciseHeaderNode='exerciseHeaderNode';
	var exerciseAllowedTimeNode='currentExerciseNodeAllowedTimeToDisplay';
	var exerciseImageListNode='exerciseNodeImageList';
	var exerciseContainerNode='exerciseNodeContainer';
	
	var exerciseObjectList=[];
	
	var selectedExerciseNodeIndex=0;
	var selectedExerciseNodeImageIndex=0;
	
	function showExerciseNode(node){
		$('#'+node.exerciseContainerNodeID).show();	
		$('#'+node.excerciseID).show();	
	}
	
	function hideExerciseNode(node){
		/** hide all image divs before hiding the excercise node**/
		for (var i=0; i<=node.imageIDList.length; i++) {
			var imgDivID=node.imageIDList[i];
			$('#'+imgDivID).hide();				
		}
		$('#'+node.excerciseID).hide();	
		$('#'+node.exerciseContainerNodeID).hide();	
	}
	/**
	* Initial method to fetch all excercise nodes and create one array of nodes
	*/
	$("div").each(function() {
		
		if($(this).hasClass('prem')==false){ return; }
		
		var execerciseObj=new Object();
		
		var divKiID=$(this).attr('id');
		
		execerciseObj.excerciseID=divKiID;
		var spanKiID=exerciseHeaderNode+divKiID.substr(exerciseNode.length);
		execerciseObj.exerciseHeaderID=spanKiID;		
		var allowedTimeToDisplay=exerciseAllowedTimeNode+divKiID.substr(exerciseNode.length);
		$('#'+allowedTimeToDisplay).hide();
		execerciseObj.allowedTime=$('#'+allowedTimeToDisplay).text();
		execerciseObj.imageIDList=fetchAllImageNodes(execerciseObj);
		
		execerciseObj.exerciseContainerNodeID=exerciseContainerNode+divKiID.substr(exerciseNode.length);
		
		exerciseObjectList.push(execerciseObj);
		
		hideExerciseNode(execerciseObj);
		
		$('#'+execerciseObj.exerciseHeaderID).live('click',function () {		
		  $('#'+execerciseObj.excerciseID).toggle();		  
		});
	  });
	  
	  /////////////////////
	  $('body').keypress(function(event) {			
					if(String.fromCharCode(event.charCode)=='n'){
						delay=-1;
					 }
					 if(String.fromCharCode(event.charCode)=='p'){
						loadPreviousWord();
					 }
					if(String.fromCharCode(event.charCode)=='r'){
					 
					 }
					 if(String.fromCharCode(event.charCode)=='h'){
						alert('The page\'s functionality in a help alert will come. Functionalty yet to be designed');
					 }
					 if(String.fromCharCode(event.charCode)=='l'){
						loadNext50Word();
					}
				});
	  
	  ////////////////////////
	  
	  $('#'+'nextExcerciseMover').live('click',function () {
			delay=-1;
		});
		
		
		$('#'+'previousExcerciseMover').live('click',function () {
			loadPreviousWord();
		});
		
		$('#'+'next50ExcerciseMover').live('click',function () {
			loadNext50Word();
		});
		
		
		var offset=0;
		var count=0;
		$('#'+'btnChangeSettings').live('click',function (){
			offset=document.getElementById('txtOffset').value;
			count=document.getElementById('txtCount').value;
			alert('offset == '+offset+' count == '+count);
			location.href="viewVocabsWithDivJquery.jsp?offset="+offset+"&&count="+count;
		});
		
	function loadPreviousWord(){
		hideExerciseNode(exerciseObjectList[selectedExerciseNodeIndex]);
		var secondPrevious=(selectedExerciseNodeIndex + (exerciseObjectList.length) - 2)%(exerciseObjectList.length);
		secondPrevious=parseInt(secondPrevious);
		selectedExerciseNodeIndex=secondPrevious;
		delay=-1;
	}
	function loadNext50Word(){
		hideExerciseNode(exerciseObjectList[selectedExerciseNodeIndex]);
		var secondPrevious=(selectedExerciseNodeIndex + (exerciseObjectList.length) + 49)%(exerciseObjectList.length);
		secondPrevious=parseInt(secondPrevious);
		selectedExerciseNodeIndex=secondPrevious;
		delay=-1;
	}
	  
	  /**
	  * Method to fetch all image nodes of one excercise node
	  */
	  
	  function fetchAllImageNodes(node){
			var allowedTimeToDisplay=exerciseImageListNode+node.excerciseID.substr(exerciseNode.length);
			var allImageDivIDs=[];
			$("#"+allowedTimeToDisplay).children('div').each(function() {
					var imageKiID=$(this).attr('id');
					//alert(imageKiID);
					allImageDivIDs.push(imageKiID);
			});
			return allImageDivIDs;
	  }
	  
	  
		var delay = 10;
		function winClose() {
			window.close();
		}
		
		var min=0;
		var secon=0;
		var hour =0;
		var days =0;
		function getElapsedTime(){
			secon=secon+1;	
			
			if(secon==60){ 	secon=0; 	min=min+1; 	}
			
			if(min==60){ 	min=0; 		hour=hour+1; }
			
			if(hour==24){ 	hour=0; 		days=days+1; }
			
			var mytxt='';
			
			mytxt=(days>0)?(mytxt+days+' Days '):(mytxt+'');
			mytxt=(hour>0)?(mytxt+hour+' Hours '):(mytxt+'');
			mytxt=(min>0)?(mytxt+min+' Minutes '):(mytxt+'');
			mytxt=(secon>0)?(mytxt+secon+' Seconds '):(mytxt+'');
			
			return ' Total time elapsed : '+mytxt;
			
			//if(min==60){ 	min=0; 		hour=hour+1; }
			//min=parseInt()
		}

		function runTimer() { 
			if(delay <= 0){				
				hideExerciseNode(exerciseObjectList[selectedExerciseNodeIndex]);
				
				selectedExerciseNodeIndex=getNextIndex(selectedExerciseNodeIndex,exerciseObjectList);
				
				showNextExerciseAndImages();			
			}else {
				delay--;
				
				document.getElementById('currentStatusdisplayer').innerText = 'Prem('+delay+')' +'  selectedExerciseNodeIndex : '+selectedExerciseNodeIndex+' allowedTimeVal : '+exerciseObjectList[selectedExerciseNodeIndex].allowedTime +'\n'+getElapsedTime();
				showExerciseNode(exerciseObjectList[selectedExerciseNodeIndex]);
				showNextImage(exerciseObjectList[selectedExerciseNodeIndex]);
				
			}
		}
		
		/**
		*Central method to get next index out of given array in cyclic order , i.e. 0-maxValue-0
		*/
		function getNextIndex(currIndex,arrayOfObj){
			//var offset=0;
			//var count=0;
			var max=(count==0)?arrayOfObj.length:count;
			var nxt=offset+(currIndex + (max) + 1)%(max);
			nxt=parseInt(nxt);
			return nxt;
		}
		
		function showNextImage(node){			
			hideSelectedImageDiv();			
			selectedExerciseNodeImageIndex=getNextIndex(selectedExerciseNodeImageIndex,node.imageIDList);
			showSelectedImageDiv();			
		}
		
		function showSelectedImageDiv(){ 
			var selNode=exerciseObjectList[selectedExerciseNodeIndex];
			$('#'+selNode.imageIDList[selectedExerciseNodeImageIndex]).show();
		}
		
		function hideSelectedImageDiv(){ 
			var selNode=exerciseObjectList[selectedExerciseNodeIndex];
			$('#'+selNode.imageIDList[selectedExerciseNodeImageIndex]).hide();
		}
		
		function showNextExerciseAndImages() {
			
			var allowedTimeVal=0;
			allowedTimeVal=(exerciseObjectList[selectedExerciseNodeIndex]).allowedTime;
			delay=parseInt(allowedTimeVal);
			selectedExerciseNodeImageIndex=0;
			
			showExerciseNode(exerciseObjectList[selectedExerciseNodeIndex]);
			showSelectedImageDiv();
			runTimer();
		}
</script>

</body></html>