﻿using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using SfSoft.Common;
using SfSoft.SfEmc;
using System.Text;
using SfSoft.DBUtility;
namespace SfSoft.web.emc.education.coursesorder
{
    public partial class browse : SfSoft.SfEmc.EmcBrowseBasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                BindData(GetWhere());
            }
            else
            {
                Common.SetEmptyGridView.ResetGridView(this.GridView1);
            }
        }
        //1.初始化模块ID
        protected override void VtInitMID()
        {
            hfMID.Value = "emc.education.coursesorder";
        }
        #region 初始化工具栏
        protected override void VtInitToolbars()
        {
            NewTsbtnNew();
            phToolBars.Controls.Add(tsbtnNew);
            NewTsbtnDelete();
            phToolBars.Controls.Add(tsbtnDelete);
        }

        protected override void VtInitBaseToolsBars()
        {
            VtInitBaseListToolsBars();
        }
        #endregion
        protected override void VtDelete()
        {
            string ID = EmcCommon.GetCheckedDataKey(GridView1, 0, true);
            if (ID == "")
            {
                return;
            }
            BLL.WX_CoursOrder bll = new BLL.WX_CoursOrder();
            string[] arrID = ID.Split(',');
            for (int i = 0; i < arrID.Length; i++)
            {
                int id = Common.Common.stringToInt(arrID[i].ToString());
                Model.WX_CoursOrder modelMsn = bll.GetModel(id);
                bll.Delete(id);
            }
            BindData(GetWhere());
        }
        private void BindData(string strWhere)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("select a.*,b.Topic from dbo.WX_CoursOrder a ");
            sb.Append(" left join WX_Courses b on a.coursid=b.id");
            sb.Append( " where "+strWhere );
            DataSet ds=DbHelperSQL.Query(sb.ToString());
            
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                PagedDataSource pds = new PagedDataSource();
                pds.DataSource = ds.Tables[0].DefaultView;
                AspNetPager1.RecordCount = pds.Count;
                pds.AllowPaging = true;
                pds.CurrentPageIndex = AspNetPager1.CurrentPageIndex - 1;
                pds.PageSize = AspNetPager1.PageSize;
                GridView1.PageIndex = AspNetPager1.CurrentPageIndex - 1;
                this.GridView1.DataSource = pds;
                this.GridView1.DataBind();
            }
            else
            {
                AspNetPager1.RecordCount = 0;
                Common.SetEmptyGridView.GridViewDataBind(GridView1, ds.Tables[0]);
            }
        }
        protected void GridView1_PageIndexChanging(Object sender, GridViewPageEventArgs e)
        {
            GridView1.PageIndex = e.NewPageIndex;
            BindData(GetWhere());
        }
        private string GetWhere()
        {
            string strWhere = "";
            string title = txtTitle.Text.Trim();
            string name = txtName.Text.Trim();
            strWhere = "1=1";
            if (title != "") { 
                strWhere+=" and b.Topic like '%"+title+"%'";
            }
            if (name != "")
            {
                strWhere += " and a.name like '%" + name + "%'";
            }
            strWhere += " order by a.id desc";
            return strWhere;
        }
        //删除
        protected void GridView1_RowDeleting(object sender, GridViewDeleteEventArgs e)
        {
            
        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            BindData(GetWhere());
        }
        protected new void GridView1_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            if (e.Row.RowType == DataControlRowType.DataRow)
            {
                
            }
        }
        protected void AspNetPager1_PageChanged(object sender, EventArgs e)
        {
            BindData(GetWhere());
        }
    }
}

