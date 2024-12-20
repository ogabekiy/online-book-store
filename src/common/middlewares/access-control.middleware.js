import { pool } from "../database/database.service.js";
import CustomError from "../exceptionFilter/custom.error.js";

export const accessControl = (requiredRoles) => {
  return (req, res, next) => {
    try {
      // console.log(req.user);
      const userRole = req.user.role;
      const userId = req.user.id;
      const targetUserId = req.params.id; // URL orqali kelgan user ID
      // console.log(targetUserId);
      // console.log(requiredRoles);
      if (requiredRoles.includes(userRole)) {
        console.log(userRole);
        if (userRole === "Admin" || userId == targetUserId) {
          // Admin bo'lsa yoki User o'zi haqida amal qilsa, davom etishiga ruxsat beramiz
          next();
        } else {
          throw new CustomError("Bu sahifaga huquqingiz yetarli emas?", 403);
        }
      } else {
        throw new CustomError("Ruxsat etilmagan rol", 401);
      }
    } catch (error) {
      next(error);
      console.log(error.message);
    }
  };
};
export const accessControl2 = (requiredRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      if (requiredRoles.includes(userRole)) {
        next();
      } else {
        throw new CustomError("Ruxsat etilmagan rol", 401);
      }
    } catch (error) {
      next(error);
      console.log(error.message);
    }
  };
};
// export const accessControlOrder = (requiredRoles) => {
//   return (re, res, next) => {
//     try {
//       const userRole = req.user.role;
//       const userId = req.user.id;
//       const orderDbid = pool.query(
//         `
//         SELECT * FROM orders WHERE user_id=$1
//         `,
//         [userId]
//       );
//       const ord

//       if (requiredRoles.includes(userRole)) {
//         if (userRole === "Admin" || userId == targetUserId) {
//           // Admin bo'lsa yoki User o'zi haqida amal qilsa, davom etishiga ruxsat beramiz
//           next();
//         } else {
//           throw new CustomError("Bu sahifaga huquqingiz yetarli emas", 403);
//         }
//       } else {
//         throw new CustomError("Ruxsat etilmagan rol", 401);
//       }
//     } catch (err) {
//       console.log(err.message);
//       next(err);
//     }
//   };
// };
// export default accessControl;
// export const accessControlBook = (requiredRoles) => {
//   return (req, res, next) => {
//     try {
//       const userRole = req.user.role;
//       const userId = req.user.id;
//       const targetUserId = req.params.id; // URL orqali kelgan user ID
//       const dbBook = await pool.query()
//       // console.log(targetUserId);
//       // console.log(requiredRoles);
//       if (requiredRoles.includes(userRole)) {
//         if (userRole === "Admin" || userId == targetUserId) {
//           // Admin bo'lsa yoki User o'zi haqida amal qilsa, davom etishiga ruxsat beramiz
//           next();
//         } else {
//           throw new CustomError("Bu sahifaga huquqingiz yetarli emas", 403);
//         }
//       } else {
//         throw new CustomError("Ruxsat etilmagan rol", 401);
//       }
//     } catch (err) {
//       next(err);
//       console.log(err.message);
//     }
//   };
// };

// export default accessControl;
