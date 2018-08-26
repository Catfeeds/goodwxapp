﻿using System;
using System.Data;
using System.Text;
using System.Data.SqlClient;
using SfSoft.IDAL;
using SfSoft.DBUtility;//Please add references
namespace SfSoft.SQLServerDAL
{
	/// <summary>
	/// 数据访问类:WX_QA_Award
	/// </summary>
	public partial class WX_QA_Award:IWX_QA_Award
	{
		public WX_QA_Award()
		{}
		#region  BasicMethod

		/// <summary>
		/// 得到最大ID
		/// </summary>
		public int GetMaxId()
		{
		return DbHelperSQL.GetMaxID("Id", "WX_QA_Award"); 
		}

		/// <summary>
		/// 是否存在该记录
		/// </summary>
		public bool Exists(int Id)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select count(1) from WX_QA_Award");
			strSql.Append(" where Id=@Id");
			SqlParameter[] parameters = {
					new SqlParameter("@Id", SqlDbType.Int,4)
			};
			parameters[0].Value = Id;

			return DbHelperSQL.Exists(strSql.ToString(),parameters);
		}


		/// <summary>
		/// 增加一条数据
		/// </summary>
		public int Add(SfSoft.Model.WX_QA_Award model)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("insert into WX_QA_Award(");
			strSql.Append("OpenId,AwardType,Earn,Expense)");
			strSql.Append(" values (");
			strSql.Append("@OpenId,@AwardType,@Earn,@Expense)");
			strSql.Append(";select @@IDENTITY");
			SqlParameter[] parameters = {
					new SqlParameter("@OpenId", SqlDbType.NVarChar,200),
					new SqlParameter("@AwardType", SqlDbType.Int,4),
					new SqlParameter("@Earn", SqlDbType.Int,4),
					new SqlParameter("@Expense", SqlDbType.Int,4)};
			parameters[0].Value = model.OpenId;
			parameters[1].Value = model.AwardType;
			parameters[2].Value = model.Earn;
			parameters[3].Value = model.Expense;

			object obj = DbHelperSQL.GetSingle(strSql.ToString(),parameters);
			if (obj == null)
			{
				return 0;
			}
			else
			{
				return Convert.ToInt32(obj);
			}
		}
		/// <summary>
		/// 更新一条数据
		/// </summary>
		public bool Update(SfSoft.Model.WX_QA_Award model)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("update WX_QA_Award set ");
			strSql.Append("OpenId=@OpenId,");
			strSql.Append("AwardType=@AwardType,");
			strSql.Append("Earn=@Earn,");
			strSql.Append("Expense=@Expense");
			strSql.Append(" where Id=@Id");
			SqlParameter[] parameters = {
					new SqlParameter("@OpenId", SqlDbType.NVarChar,200),
					new SqlParameter("@AwardType", SqlDbType.Int,4),
					new SqlParameter("@Earn", SqlDbType.Int,4),
					new SqlParameter("@Expense", SqlDbType.Int,4),
					new SqlParameter("@Id", SqlDbType.Int,4)};
			parameters[0].Value = model.OpenId;
			parameters[1].Value = model.AwardType;
			parameters[2].Value = model.Earn;
			parameters[3].Value = model.Expense;
			parameters[4].Value = model.Id;

			int rows=DbHelperSQL.ExecuteSql(strSql.ToString(),parameters);
			if (rows > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		/// <summary>
		/// 删除一条数据
		/// </summary>
		public bool Delete(int Id)
		{
			
			StringBuilder strSql=new StringBuilder();
			strSql.Append("delete from WX_QA_Award ");
			strSql.Append(" where Id=@Id");
			SqlParameter[] parameters = {
					new SqlParameter("@Id", SqlDbType.Int,4)
			};
			parameters[0].Value = Id;

			int rows=DbHelperSQL.ExecuteSql(strSql.ToString(),parameters);
			if (rows > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		/// <summary>
		/// 批量删除数据
		/// </summary>
		public bool DeleteList(string Idlist )
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("delete from WX_QA_Award ");
			strSql.Append(" where Id in ("+Idlist + ")  ");
			int rows=DbHelperSQL.ExecuteSql(strSql.ToString());
			if (rows > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		}

        public SfSoft.Model.WX_QA_Award GetModel(string openId, int awardType)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select  top 1 Id,OpenId,AwardType,Earn,Expense from WX_QA_Award ");
            strSql.Append(" where OpenId=@openId");
            strSql.Append(" and AwardType=@AwardType");
            SqlParameter[] parameters = {
					new SqlParameter("@openId", SqlDbType.NVarChar,100),
                    new SqlParameter("@AwardType", SqlDbType.Int,4),
			};
            parameters[0].Value = openId;
            parameters[1].Value = awardType;

            SfSoft.Model.WX_Yuedu_Award model = new SfSoft.Model.WX_Yuedu_Award();
            DataSet ds = DbHelperSQL.Query(strSql.ToString(), parameters);
            if (ds.Tables[0].Rows.Count > 0)
            {
                return DataRowToModel(ds.Tables[0].Rows[0]);
            }
            else
            {
                return null;
            }
        }
		/// <summary>
		/// 得到一个对象实体
		/// </summary>
		public SfSoft.Model.WX_QA_Award GetModel(int Id)
		{
			
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select  top 1 Id,OpenId,AwardType,Earn,Expense from WX_QA_Award ");
			strSql.Append(" where Id=@Id");
			SqlParameter[] parameters = {
					new SqlParameter("@Id", SqlDbType.Int,4)
			};
			parameters[0].Value = Id;

			SfSoft.Model.WX_QA_Award model=new SfSoft.Model.WX_QA_Award();
			DataSet ds=DbHelperSQL.Query(strSql.ToString(),parameters);
			if(ds.Tables[0].Rows.Count>0)
			{
				return DataRowToModel(ds.Tables[0].Rows[0]);
			}
			else
			{
				return null;
			}
		}


		/// <summary>
		/// 得到一个对象实体
		/// </summary>
		public SfSoft.Model.WX_QA_Award DataRowToModel(DataRow row)
		{
			SfSoft.Model.WX_QA_Award model=new SfSoft.Model.WX_QA_Award();
			if (row != null)
			{
				if(row["Id"]!=null && row["Id"].ToString()!="")
				{
					model.Id=int.Parse(row["Id"].ToString());
				}
				if(row["OpenId"]!=null)
				{
					model.OpenId=row["OpenId"].ToString();
				}
				if(row["AwardType"]!=null && row["AwardType"].ToString()!="")
				{
					model.AwardType=int.Parse(row["AwardType"].ToString());
				}
				if(row["Earn"]!=null && row["Earn"].ToString()!="")
				{
					model.Earn=int.Parse(row["Earn"].ToString());
				}
				if(row["Expense"]!=null && row["Expense"].ToString()!="")
				{
					model.Expense=int.Parse(row["Expense"].ToString());
				}
			}
			return model;
		}

		/// <summary>
		/// 获得数据列表
		/// </summary>
		public DataSet GetList(string strWhere)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select Id,OpenId,AwardType,Earn,Expense ");
			strSql.Append(" FROM WX_QA_Award ");
			if(strWhere.Trim()!="")
			{
				strSql.Append(" where "+strWhere);
			}
			return DbHelperSQL.Query(strSql.ToString());
		}

		/// <summary>
		/// 获得前几行数据
		/// </summary>
		public DataSet GetList(int Top,string strWhere,string filedOrder)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select ");
			if(Top>0)
			{
				strSql.Append(" top "+Top.ToString());
			}
			strSql.Append(" Id,OpenId,AwardType,Earn,Expense ");
			strSql.Append(" FROM WX_QA_Award ");
			if(strWhere.Trim()!="")
			{
				strSql.Append(" where "+strWhere);
			}
			strSql.Append(" order by " + filedOrder);
			return DbHelperSQL.Query(strSql.ToString());
		}

		/// <summary>
		/// 获取记录总数
		/// </summary>
		public int GetRecordCount(string strWhere)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select count(1) FROM WX_QA_Award ");
			if(strWhere.Trim()!="")
			{
				strSql.Append(" where "+strWhere);
			}
			object obj = DbHelperSQL.GetSingle(strSql.ToString());
			if (obj == null)
			{
				return 0;
			}
			else
			{
				return Convert.ToInt32(obj);
			}
		}
		/// <summary>
		/// 分页获取数据列表
		/// </summary>
		public DataSet GetListByPage(string strWhere, string orderby, int startIndex, int endIndex)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("SELECT * FROM ( ");
			strSql.Append(" SELECT ROW_NUMBER() OVER (");
			if (!string.IsNullOrEmpty(orderby.Trim()))
			{
				strSql.Append("order by T." + orderby );
			}
			else
			{
				strSql.Append("order by T.Id desc");
			}
			strSql.Append(")AS Row, T.*  from WX_QA_Award T ");
			if (!string.IsNullOrEmpty(strWhere.Trim()))
			{
				strSql.Append(" WHERE " + strWhere);
			}
			strSql.Append(" ) TT");
			strSql.AppendFormat(" WHERE TT.Row between {0} and {1}", startIndex, endIndex);
			return DbHelperSQL.Query(strSql.ToString());
		}

		/*
		/// <summary>
		/// 分页获取数据列表
		/// </summary>
		public DataSet GetList(int PageSize,int PageIndex,string strWhere)
		{
			SqlParameter[] parameters = {
					new SqlParameter("@tblName", SqlDbType.VarChar, 255),
					new SqlParameter("@fldName", SqlDbType.VarChar, 255),
					new SqlParameter("@PageSize", SqlDbType.Int),
					new SqlParameter("@PageIndex", SqlDbType.Int),
					new SqlParameter("@IsReCount", SqlDbType.Bit),
					new SqlParameter("@OrderType", SqlDbType.Bit),
					new SqlParameter("@strWhere", SqlDbType.VarChar,1000),
					};
			parameters[0].Value = "WX_QA_Award";
			parameters[1].Value = "Id";
			parameters[2].Value = PageSize;
			parameters[3].Value = PageIndex;
			parameters[4].Value = 0;
			parameters[5].Value = 0;
			parameters[6].Value = strWhere;	
			return DbHelperSQL.RunProcedure("UP_GetRecordByPage",parameters,"ds");
		}*/

		#endregion  BasicMethod
		#region  ExtensionMethod

		#endregion  ExtensionMethod
	}
}
