package com.p.parctice.order.mapper;

import com.p.parctice.order.entity.Order;
import com.p.parctice.order.pojo.OrderPojo;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class OrderMapper {

    public OrderPojo convertToPojo(Order order){
        if(order==null) return null;
        return OrderPojo.builder()
                .id(order.getId())
                .orderDate(order.getOrderDate())
                .customerName(order.getCustomerName())
                .build();
    }

    public Order convertToEntity(OrderPojo pojo){
        if(pojo==null) return null;
        return Order.builder()
                .id(pojo.getId())
                .orderDate(pojo.getOrderDate())
                .customerName(pojo.getCustomerName())
//                .products(pojo.getProducts())
                .build();
    }
}
