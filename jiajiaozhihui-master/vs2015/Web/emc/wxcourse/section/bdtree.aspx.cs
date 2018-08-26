﻿using System;
using System.Data;
using System.Linq;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Collections.Generic;

namespace SfSoft.web.emc.wxcourse.section
{
    public partial class bdtree : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            if (!IsPostBack)
            {
                //Run();
                LoadTree();
            }
        }

        
        private void LoadTree()
        {
            List<dynamic> list = GetGroupList();
            TreeNode rootnode = new TreeNode();
            rootnode.Expanded = true;
            rootnode.NavigateUrl = "javascript:void('0')";
            rootnode.Text = "课程章节设置";
            BDTreeView.Nodes.Add(rootnode);
            foreach (var media in list) {
                /*课程类型*/
                TreeNode treenode =new TreeNode();
                treenode.Text = media.Name;
                treenode.NavigateUrl = "javascript:void('0')";
                rootnode.ChildNodes.Add(treenode);
                foreach (var theme in media.List) {
                    /*主题*/
                    TreeNode treenode1 = new TreeNode();
                    treenode1.Text = theme.Name;
                    treenode1.NavigateUrl = "javascript:void('" + theme.Id.ToString() + "','')";
                    treenode.ChildNodes.Add(treenode1);
                    foreach (var m in theme.List) {
                        /*课程*/
                        TreeNode treenode2 = new TreeNode();
                        treenode2.Text = m.Name;
                        treenode2.NavigateUrl = "javascript:OpenDocument('" + m.Id + "','')";
                        treenode1.ChildNodes.Add(treenode2);
                        foreach (var session in m.List) {
                            /*章节*/
                            TreeNode treenode3 = new TreeNode();
                            treenode3.Text = "第" + ((session.Sn ?? 0) + 1) + "章 " + session.Name;
                            treenode3.NavigateUrl = "javascript:OpenDocument('" + session.CoursesId + "'," + session.Id + ")";
                            treenode2.ChildNodes.Add(treenode3);
                        }
                    }
                }
            }
        }

        
        private void Run()
        {
            TreeNode rootnode = new TreeNode();
            rootnode.Expanded = true;
            rootnode.NavigateUrl = "javascript:void('0')";

            rootnode.Text = "课程章节设置";
            BDTreeView.Nodes.Add(rootnode);

            DataSet ds = ThemeList();
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                TreeNode treenode = null;
                BLL.WX_Course bll = new BLL.WX_Course();
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    treenode = new TreeNode();
                    treenode.Text = dr.Field<string>("RefValue");
                    treenode.NavigateUrl = "javascript:void('0')";
                    rootnode.ChildNodes.Add(treenode);
                    var list = bll.GetModelList("Theme=" + dr.Field<string>("RefValueCode") + " and MediaType<>0");
                    foreach (var model in list)
                    {
                        CreateTree(treenode, model);
                    }
                }
            }
        }

        private DataSet ThemeList()
        {
            BLL.Pub_BaseData bll = new BLL.Pub_BaseData();
            DataSet ds = bll.GetList("refobj='weixin.wxcourse.theme' and IsAct=1");
            return ds;
        }
        private void CreateTree(TreeNode rootnode, Model.WX_Course model)
        {
            TreeNode treenode = new TreeNode();
            treenode.Text = model.Name;
            string CID = model.Id.ToString();
            treenode.NavigateUrl = "javascript:OpenDocument('" + CID + "','')";
            rootnode.ChildNodes.Add(treenode);
            CreateSubTree(model.Id, treenode);
        }
        private void CreateSubTree(int pid, TreeNode rootnode)
        {
            BLL.WX_Course_Section bll = new BLL.WX_Course_Section();
            var list = bll.GetModelList("ClassifyId=" + pid + " and Pid is Null");
            TreeNode treenode = null;
            foreach (Model.WX_Course_Section model in list)
            {
                treenode = new TreeNode();
                treenode.Text = "第" + ((model.Sn ?? 0) + 1) + "章 " + model.SectionName;
                string CID = model.Id.ToString();
                treenode.NavigateUrl = "javascript:OpenDocument('" + pid + "'," + CID + ")";
                rootnode.ChildNodes.Add(treenode);
            }
        }
        /*课程类型*/
        private List<dynamic> GetGroupList()
        {
            Helper.Helper helper = new Helper.Helper();
            var courseTypes = helper.InitCourseType();

            BLL.WX_Course bll = new BLL.WX_Course();
            var list = bll.GetModelList("");
            var query = from q in list
                        select new { MediaType = q.MediaType ?? 1};

            var mediaTypeList = query.Distinct();
            List<dynamic> groupCourse = new List<dynamic>();
            foreach (var m in courseTypes)
            {
                var _list = list.Where(e => e.CourseType == m.Value);
                groupCourse.Add(new
                {
                    Id=m.Value,
                    Name = m.Name,
                    List = GroupTheme(_list, m.Value)
                });
            }
            return groupCourse;
        }
        /// <summary>
        /// 主题
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        private List<dynamic> GroupTheme(IEnumerable<SfSoft.Model.WX_Course> list,int courseType)
        {
            BLL.Pub_BaseData bll = new BLL.Pub_BaseData();
            var ds = bll.GetList("RefObj='weixin.wxcourse.theme'");

            var query = from m in list
                        select new { Theme = m.Theme };
            var themeList = query.Distinct();
            List<dynamic> themes = new List<dynamic>();
            foreach (var m in themeList)
            {
                themes.Add(new
                {
                    Id=m.Theme,
                    Name = GetThemeName(ds, m.Theme.ToString()),                    
                    List= GroupCourse(courseType, m.Theme.ToString())
                });
            }
            return themes;
        }
        /// <summary>
        /// 课程
        /// </summary>
        /// <param name="mediaType"></param>
        /// <param name="themeId"></param>
        /// <returns></returns>
        private List<dynamic> GroupCourse(int courseType, string themeId)
        {
            BLL.WX_Course bll = new BLL.WX_Course();
            var list = bll.GetModelList("CourseType=" + courseType + " and Theme=" + themeId);
            List<dynamic> courses = new List<dynamic>();
            foreach (var m in list) {
                courses.Add(new
                {
                    Id = m.Id,
                    Name = m.Name,
                    List = GroupSection(m.Id.ToString())
                });
            }
            return courses;
        }
        /// <summary>
        /// 章节
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        private List<dynamic> GroupSection(string coursesId)
        {
            
            BLL.WX_Course_Section sectionBll = new BLL.WX_Course_Section();
            var list= sectionBll.GetModelList("ClassifyId="+coursesId+"  and isnull(Pid,0)=0");
            List<dynamic> sections = new List<dynamic>();
            foreach (var m in list) {
                sections.Add(new
                {
                    CoursesId=m.ClassifyId,
                    Id=m.Id,
                    Sn=m.Sn,
                    Name=m.SectionName
                });
            }
            return sections;
        }
        private string GetThemeName(DataSet ds, string value)
        {
            string result = "";
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                if (dr.Field<string>("RefValueCode") == value)
                {
                    result = dr.Field<string>("RefValue");
                }
            }
            return result;
        }
    }
}

