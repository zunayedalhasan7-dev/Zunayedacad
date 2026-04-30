import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, DollarSign, PlusCircle, Video, Star, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InstructorDashboard() {
  const stats = [
    { title: 'Total Courses', value: '12', icon: <BookOpen className="h-6 w-6 text-primary-600" />, bg: 'bg-primary-50 border border-primary-100' },
    { title: 'Total Students', value: '3,450', icon: <Users className="h-6 w-6 text-emerald-400" />, bg: 'bg-emerald-400/10 border border-emerald-400/20' },
    { title: 'Total Earnings', value: '৳ 450,000', icon: <DollarSign className="h-6 w-6 text-amber-400" />, bg: 'bg-amber-400/10 border border-amber-400/20' },
    { title: 'Average Rating', value: '4.8', icon: <Star className="h-6 w-6 text-rose-400" />, bg: 'bg-rose-400/10 border border-rose-400/20' },
  ];

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Instructor Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's an overview of your teaching journey.</p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:shadow-sm transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
          <span className="relative z-10 flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Course
          </span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white  p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4 relative overflow-hidden group hover:border-slate-200 transition-colors"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-full blur-2xl group-hover:bg-primary-50 transition-colors"></div>
            <div className={`p-4 rounded-xl ${stat.bg} relative z-10`}>
              {stat.icon}
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 font-sans">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="bg-white  rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Courses</h2>
          <Link to="/instructor/courses" className="text-primary-600 font-medium hover:text-primary-600/80 text-sm transition-colors border border-transparent hover:border-primary-100 px-3 py-1 rounded-full">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Enrolled</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { title: 'SSC Math Special Batch', status: 'Published', students: 1200, price: '৳999', thumb: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=100&auto=format&fit=crop&q=60' },
                { title: 'Complete English Grammar', status: 'Draft', students: 0, price: '৳599', thumb: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&auto=format&fit=crop&q=60' },
                { title: 'Advance Physics Series', status: 'Published', students: 850, price: '৳1200', thumb: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&auto=format&fit=crop&q=60' },
              ].map((course, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 border-l-2 border-transparent group-hover:border-primary-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <img src={course.thumb} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                      <span className="font-medium text-slate-900 group-hover:text-primary-600 transition-colors">{course.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      course.status === 'Published' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-sans">{course.students}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 font-sans">{course.price}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Edit">
                         <Edit className="w-4 h-4" />
                       </button>
                       <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 transition-colors" title="Delete">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
